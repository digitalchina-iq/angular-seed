import { Component, forwardRef, ViewChild, OnInit, Input, Output, ElementRef, ComponentRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

declare var $;

@Component({
  selector: "iq-select",
  templateUrl: './iq-select.component.html',
  styleUrls: ['./iq-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IqSelectComponent),
      multi: true
    }
  ]
})
export class IqSelectComponent implements OnInit, ControlValueAccessor {
  constructor(private el: ElementRef, private http: Http) {}

  selectedItem: any;//被选项
  optionShow: boolean;//下拉框出现
  resetEvent: any;//重置
  keyWord: string;
  optionList: any[] = [];
  private _optionList: any[] = [];
  itemString: boolean = false;

  searchStream = new Subject<string>();


  private onChangeCallback:any={};
  private onTouchedCallback:any={};

  @Input() listApi: string;//下拉列表选项api
  @Input() method: string = 'get';//默认请求类型
  @Input() placeHolder: string;
  @Input() noSearch: boolean = false;//隐藏搜索框
  @Input() disabled: boolean = false;//禁用
  @Input() queryParams: any = {};//额外的查询参数
  @Input() keyWordAlias: string;//keyWord别名
  @Input() required: boolean = false;
  @Input() itemValue: number = 0;//ngModel绑定值的位置
  @Input() handleData: any = (arg)=>arg;

  @Output() onSelect = new EventEmitter();
  @Output() getData = new EventEmitter();

  ngOnInit(){

    if(this.disabled){
      return;
    }

    let $dom = $(this.el.nativeElement);//获得当前元素

    this.resetEvent = () => this.resetSearch();

    //阻止冒泡
    $dom.on("mousedown",($event)=>{
      $event.stopPropagation();
    });

    $("body").on("mousedown", this.resetEvent);

    this.searchStream
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((keyWord: string) => {
        if(keyWord !== undefined){
          this.getOptionList();
        }
      });
  }

  getOptionList(){//获取下拉列表项

    let tmpObj = {keyWord: this.keyWord};

    if(!!this.keyWordAlias){
      tmpObj[this.keyWordAlias] = this.keyWord;
    }

    let httpObs = this.method == 'get' ? this.http.get(this.listApi, {params: Object.assign(tmpObj, this.queryParams)}) : this.http.post(this.listApi, Object.assign(tmpObj, this.queryParams));

    httpObs.toPromise()
    .then(res => res.json())
    .then(data => {
      this.getData.emit(data);
      return data;
    })
    .then(this.handleData)
    .then((list: any[]) => {
      if(!(list instanceof Array)){console.error('函数处理返回结果必须是数组');return};

      this.itemString = typeof list[0] == 'string';
      this.optionList = list;
      if(!this.itemString){
        this._optionList = list.map(item =>  item.reduce((p,c) => p+' '+c));
      }
    });
  }

  ngOnDestroy(){
    $("body").off("mousedown", this.resetEvent);
  }

  toggle(){
    if(this.disabled){return;}

    this.optionShow = !this.optionShow;

    if(this.optionShow){
      this.getOptionList();
    }
  }

  //搜索
  search(keyWord){
    this.searchStream.next(keyWord);
  }

  resetSearch(){//重置搜索条件
    this.optionShow = false;
    this.optionList.length = 0;
    this._optionList.length = 0;
    this.keyWord = '';
  }

  chooseItem(item){//选择下拉选项
    this.selectedItem = item;
    this.onChangeCallback(item);
    this.onSelect.emit(item);
    this.resetSearch();
  }

  chooseIndex(i){
    let choosedItem = this.optionList[i][this.itemValue];
    this.selectedItem = this._optionList[i];
    this.onChangeCallback(choosedItem);
    this.onSelect.emit({item: choosedItem, index: i});
    this.resetSearch();
  }

  writeValue(value) {
    this.selectedItem = value;
  }

  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

}
