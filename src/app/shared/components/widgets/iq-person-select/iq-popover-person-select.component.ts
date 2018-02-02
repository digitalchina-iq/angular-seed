import { Component, OnInit, OnDestroy, ElementRef, Input, Output, forwardRef, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../../../environments/environment';

declare var $,document;

@Component({
  selector: 'iq-dppopover-select',
  templateUrl: 'iq-popover-person-select.component.html',
  styleUrls:['iq-popover-person-select.component.scss']
})
export class IqPopoverDepartmentPersonSelectComponent implements OnInit,OnDestroy {
  constructor(private el: ElementRef) {  }

  _show = false;
  position = "down";
  maxHeight = 300;
  rightOver: boolean;//是否超出浏览器右侧边框

  show(e){
    this._show = true;
    if(!this.searchInput){
      let $dom = $(this.el.nativeElement);
      this.searchInput = $("input",$dom);
      this.searchInput.val('');
    }

    let p = this.el.nativeElement.getBoundingClientRect();
    let clientHeight = document.body.clientHeight,
        clientWidth  = document.body.clientWidth;
    if(p.top > clientHeight - this.maxHeight){
      this.position = "up";
    }else{
      this.position = "down";
    }

    setTimeout(()=>{
      const dom = this.el.nativeElement.children[0].children[0],
          domRect = dom.getBoundingClientRect();
      this.rightOver = domRect.right > clientWidth;
      //focus can not be set when element is hidden,so set focus after element be shown
      this.searchInput.focus();
    },0)  
  }

  hide(){
    this.clearStatusBeforeHide(this);
  }

  removeEvent = null;

  @Input("hasButton")
  hasButton = true;

  @Input("queryObservable")
  queryObservable: Observable<any[]>;

  @Output()//查询方法，
  onQuery = new EventEmitter();

  @Output()//选中值方法，
  onChoose = new EventEmitter();

  @Output()//focus方法，
  onFocus = new EventEmitter();

  @Output()//点击按钮方法
  onButton = new EventEmitter();

  searchInput;

  searchTermStream = new Subject<string>();

  //阻止点击事件
  stopClick(e){
    e.stopPropagation();
  }
  //查询
  search(term?: string) {
    this.searchTermStream.next(term);
  }
  focus(){
    this.onFocus.emit();
  }
  choose(item){
    this.onChoose.emit(item);
  }
  clickBtn(v){
    this.onButton.emit(v);
  }
  ngOnDestroy(){
    $("body").off("mousedown",this.removeEvent);
  }
  ngOnInit() {
    let t_this = this;
    let $dom = $(this.el.nativeElement);
    this.removeEvent = function(){
      t_this.clearStatusBeforeHide(t_this);
    }
    //阻止冒泡
    $dom.on("mousedown",($event)=>{
      $event.stopPropagation();
    })
    $("body").on("mousedown",this.removeEvent);

    this.searchTermStream
      .debounceTime(environment.debounceTime)
      .distinctUntilChanged()
      .subscribe((term: string) => {
        if(term !== undefined){
          this.onQuery.emit(term);
        }
      });
  }
  clearStatusBeforeHide(pthis){
    if(pthis._show){
      pthis.search();
      //清空查询
      if(!pthis.searchInput){
        let $dom = $(pthis.el.nativeElement);
        pthis.searchInput = $("input",$dom);
      }
      pthis.searchInput.val('');
      pthis.queryObservable = null;
      pthis._show = false;
    }
  }
}
