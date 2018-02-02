import { Component, OnInit, Input, Output, forwardRef, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { XcBaseModal, XcModalService } from 'app/shared/modules/xc-modal-module/index';
import { ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators} from '@angular/forms';

import { environment } from 'environments/environment';
import { Person, PersonService } from 'app/shared/services/index';


const HIDE_DEBOUNCE_TIME = 300;


@Component({
  templateUrl: 'iq-dialog-person-select.component.html',
  styleUrls: ['./iq-dialog-person-select.component.scss']
})
export class IqDialogDepartmentPersonSelectComponent implements XcBaseModal, OnInit {
  constructor(private xcModalService: XcModalService,
    private personService: PersonService) {
      let sub = null;
    this.searchTermStream
      .debounceTime(environment.debounceTime)
      .distinctUntilChanged()
      .subscribe((term: string) => {
        if(sub){//如果有订阅，取消订阅。（即可以取消之前发送请求）
          sub.unsubscribe();
        }
        sub = this.query(term);
        // return null;
      });
  }

  menu: 'person'|'department' = 'person';

  which: string = 'person';

  searchList = [];//搜索结果列表
  selectList = [];//已选则列表
  selectedPeronsList = [];//已选人员列表
  selectedDepartmentList = [];//已选部门列表

  departmentList = {person: [], department: []};
  isShow = false;
  personOverflow: boolean;//人数过多
  departmentOverflow: boolean;//部门过多
  isSearching: boolean;//是否在搜索
  private toggleSubject: Subject<string> = new Subject<string>();
  private subscriber: Subscription;

  list = [];//原数据

  private _searchkey: string;
  private _searchKeyCache = {department: '', person: ''};
  set searchkey(key) {
    this._searchkey = key;
    this._searchKeyCache[this.menu] = key;
    this.search(this._searchkey);
  }
  get searchkey() {
    return this._searchkey;
  }

  queryObservable: Observable<any[]>;
  @Input("title") title;//弹出框标题

  @Input("key") KEY = "id";//匹配list中对象是否相同识别的属性，默认id
  @Output()//查询方法，
  onQuery = new EventEmitter();

  modal;
  choosed = {};

  searchTermStream = new Subject<string>();

  ngOnInit() {
    if(this.which === 'department') {
      this.menu = 'department';
    }

    this.modal = this.xcModalService.getInstance(this);
    if (this.modal) {
      //生命周期方法中有个内置的_this指向this
      let t_this = this;
      let initdata = function(list?) {
        if (list) {
          t_this.list = list;
          t_this.selectList = [].concat(list);
        } else {
          t_this.selectList = [].concat(t_this.list);
        }
        t_this.choosed = {};
        t_this.selectedPeronsList = [];
        t_this.selectedDepartmentList = [];

        t_this.selectList.forEach((k, v) => {
          if(k.itcode){
            t_this.choosed[k[t_this.KEY]] = true;
            t_this.selectedPeronsList.push(k);
          } else {
            t_this.choosed[k.id] = true;
            t_this.selectedDepartmentList.push(k);
          }
        })
        setTimeout(()=>{
          t_this.isShow = true;
        })
      }
      this.modal.onShow().subscribe(initdata);
      //如果创建了模型直接打开，onshow可能不会触发（先广播了，再绑定的）。因此手工调一次初始化数据
      initdata(this.list);
    }

    this.getInitItem();
    this.toggleSubject.next(this.which === 'department' ? 'department' : 'person');
  }

  toggleMenu(v) {
    this.menu = v;
    this.searchkey = this._searchKeyCache[v];
    if(this.subscriber) {
      this.subscriber.unsubscribe();
    }

    /**
     *判断人员或部门数量是否超出，且部门列表是否已获取过
     */
    let subNext = (overflow) => {
      if(!overflow && !this.departmentList[v].length) {
        this.toggleSubject.next(v);
      }
    }

    if(v === 'person') {
      this.title = '人员选择';
      subNext(this.personOverflow);
    } else {
      this.title = '部门选择';
      subNext(this.departmentOverflow);
    }
  }

  /**
   *初始化时获取人员数量
   */
  initPersons():Observable<boolean> {
    return this.personService.getPersonsCount().map(result => {
      let bool: boolean = result.data < 1500;
      this.personOverflow = !bool;
      return bool;
    })
  }

  /**
   *初始化时获取部门数量
   */
  initDepartments():Observable<boolean> {
    return this.personService.getDepartmentsCount().map(result => {
      let bool: boolean = result.data < 300;
      this.departmentOverflow = !bool;
      return bool;
    })
  }

  /**
   *获取初始化时部门列表对象
   */
  getInitItem() {
    this.toggleSubject
      .switchMap(v => v === 'person' ? this.initPersons() : this.initDepartments())
      .subscribe(bool => {
        if(bool && !this.departmentList[this.menu].length) {
          this.subscriber = this.personService.getDepartments()
            .map(response => response.json().data)
            .subscribe(list => {
              this.departmentList[this.menu] = list;
              this.subscriber = null;
            })
        }
      })
  }

  //查询
  search(term: string) {
    this.searchTermStream.next(term);
  }

  //隐藏调用方法
  hide(list = null) {
    if (this.modal) {
      this.isShow = false;
      setTimeout( ()=>{
        this.modal.hide(list);
      }, HIDE_DEBOUNCE_TIME)
    } else {
      this.isShow = false;
    }
  }
  //清空操作
  clear() {
    this.selectedPeronsList = [];
    this.selectedDepartmentList = [];
    this.choosed = {};
  }
  toggle(item) {
    let flag = false;
    let i = 0;
    for (i = 0; i < this.selectedPeronsList.length && !flag; i++) {
      if (this.selectedPeronsList[i][this.KEY] == item[this.KEY]) {
        flag = true;
      }
    }
    if (!flag) {
      this.choosed[item[this.KEY]] = true;
      this.selectedPeronsList.push(item);
    } else {
      this.choosed[item[this.KEY]] = false;
      this.selectedPeronsList.splice(i - 1, 1);
    }
  }

  chooseDepartment(item) {
    let flag = false;
    let i = 0;
    for (i = 0; i < this.selectedDepartmentList.length && !flag; i++) {
      if (this.selectedDepartmentList[i].id == item.id) {
        flag = true;
      }
    }
    if (!flag) {
      this.choosed[item.id] = true;
      this.selectedDepartmentList.push(item);
    } else {
      this.choosed[item.id] = false;
      this.selectedDepartmentList.splice(i - 1, 1);
    }
  }

  //删除一个部门
  removeDepartment(item) {
    let index = this.selectedDepartmentList.indexOf(item);
    if (index > -1) {
      this.choosed[item.id] = false;
      this.selectedDepartmentList.splice(index, 1);
      //使用Immutable数据以执行变更检测
      this.selectedDepartmentList = JSON.parse(JSON.stringify(this.selectedDepartmentList));
    }
  }

  //删除一条人员
  removePeron(item) {
    let index = this.selectedPeronsList.indexOf(item);
    if (index > -1) {
      this.choosed[item[this.KEY]] = false;
      this.selectedPeronsList.splice(index, 1);
      //使用Immutable数据以执行变更检测
      this.selectedPeronsList = JSON.parse(JSON.stringify(this.selectedPeronsList));
    }
  }
  //确认按钮 将选中的值 覆盖到原数组
  confirm() {
    if (!this.list) {
      this.list = [];
    }
    this.list.length = 0;
    this.selectedPeronsList.concat(this.selectedDepartmentList).forEach((v) => {
      this.list.push(v);
    });
    this.hide(this.list);
  }

  query(term: string) {
    this.isSearching = true;
    this.searchList.length = 0;
    let sub;
    if(this.menu === 'department') {
      sub = this.personService.queryDepartments(term).subscribe(list => {
        this.isSearching = false;
        this.searchList = list;
        this.selectedDepartmentList.forEach(item => {
          this.choosed[item.id] = true;
        })
      });
    } else {
      sub = this.personService.query(term).subscribe( list => {
        this.isSearching = false;
        this.searchList = list;
        this.selectedPeronsList.forEach(item => {
          this.choosed[item.id] = true;
        })
      });
    }
    return sub;
  }
}
