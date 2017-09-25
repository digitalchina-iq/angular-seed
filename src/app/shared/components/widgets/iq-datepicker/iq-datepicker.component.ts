import { Component, OnInit, Input, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector:'iq-datepicker',
    templateUrl: 'iq-datepicker.component.html',
    styleUrls: ['iq-datepicker.component.scss'],
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IqDatePickerComponent),
      multi: true
    }]
})
export class IqDatePickerComponent implements ControlValueAccessor,OnInit {

  today: Date = new Date();//用于设置默认选择今天

  year: any = this.today.getFullYear();
  month: any = this.today.getMonth();
  day: any = this.today.getDate();//选择高亮的day
  _day: any = '';//暂存被选择的day

  choosedDate: any = "";//显示选择的日期
  startday: any;//开始日期
  endday: any;//结束日期
  disabledStartDate: any = 0;//小于开始日期不能被选择
  disabledEndDate: any = 32;//大于开始结束不能被选择
  disabledPrevMonth: boolean = false;//禁用上个月
  disabledNextMonth: boolean = false;//禁用下个月
  bindDate: any;//双向绑定的日期

  yearList:any = [];//年份列表
  monthList:any = [];//月份列表

  prevMonth: any[] = [];//前一个月
  currentMonth: any[] = [];//当前月
  nextMonth: any[] = [];//下个月

  show: boolean = false;//日期组件展示与否
  isDisabled: boolean = false;//组件被禁用状态
  onChangeCallback: any;
  onTouchedCallback: any;
  public clickClose;

  @Input() minYear = this.today.getFullYear() - 80;//默认最小年份
  @Input() maxYear = this.today.getFullYear() + 20;//默认最大年份
  @Input() placeHolder = "";
  @Input() required: boolean = false;//必填
  @Input() format: string;
  @Input() set startDate(v){
    if(!v){
      this.disabledStartDate = 0;
      this.startday = undefined;
    }else{
      this.startday = new Date(v);
      this.checkStartDate();
    }
  };//起始日期

  @Input() set endDate(v){
    if(!v){
      this.disabledEndDate = 32;
      this.endday = undefined;
      return;
    }else{
      this.endday = new Date(v);
      this.checkEndDate();
    }
  };//结束日期

  @ViewChild("iqDatePicker") iqDatePicker: ElementRef;

  constructor() {}

  checkStartDate(){//检查小于开始日期被禁用
    let _y = this.startday.getFullYear(),
        _m = this.startday.getMonth();


    if(this.year == _y){
      if(this.month == _m){
        this.disabledStartDate = this.startday.getDate();
      }else if(this.month > _m){
        this.disabledStartDate = 0;
      }else{
        this.disabledStartDate = 32;
      }
    }else if(this.year > _y){
      this.disabledStartDate = 0;
    }else{
      this.disabledStartDate = 32;
    }
  }

  checkEndDate(){//检查大于结束日期被禁用
    let _y = this.endday.getFullYear(),
        _m = this.endday.getMonth();


    if(this.year == _y){
      if(this.month == _m){
        this.disabledEndDate = this.endday.getDate();
      }else if(this.month > _m){
        this.disabledEndDate = 0;
      }else{
        this.disabledEndDate = 32;
      }
    }else if(this.year > _y){
      this.disabledEndDate = 0;
    }else{
      this.disabledEndDate = 32;
    }
  }

  addZero(n): string{//单位数添加0
    return Number(n) < 10 ? '0' + n : '' + n;
  }

  writeValue(value: any){
    if(!value){
      this.bindDate = "";
      this.choosedDate = "";
    }else{
      this.bindDate = new Date(value);

      this._day = this.bindDate.getDate();//暂存当前存入的day
      this.year = this.bindDate.getFullYear();
      this.month = this.bindDate.getMonth();
      
      this.choosedDate = this.year + '-' + this.addZero(Number(this.month) + 1) + '-' + this.addZero(this._day);
    }
    
    this.getDate(this.year, this.month);
  }

  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean){
    this.isDisabled = isDisabled;
  }

  ngOnInit(){
    for(let i = this.minYear; i <= this.maxYear; i++){//获取年份列表
      this.yearList.push(i);
    }
    for(let i = 0; i < 12; i++){//获取月份列表
      this.monthList.push(i);
    }

    let _this = this;
    let datePickerElement = _this.iqDatePicker.nativeElement;
    this.clickClose = function(e){
      if(_this.show){
        if(e.target != datePickerElement && !datePickerElement.contains(e.target)) {
          _this.show = false;
        }
      }
    }
    document.addEventListener('mousedown',_this.clickClose);
  }

  ngOnDestroy(){
    let _this = this;
    document.removeEventListener('mousedown',_this.clickClose);
  }

  showPicker(){
    this.show = true;
  }

  hidePicker(){
    this.show = false;
  }

  //根据年份月份获得日期
  getDate(year, month){
    if(this.startday){
      this.checkStartDate();
    }
    if(this.endday){
      this.checkEndDate();
    }

    this.prevMonth.length = 0;
    this.currentMonth.length = 0;
    this.nextMonth.length = 0;

    this.year = Number(this.year);
    this.month = Number(this.month);

    let monthLen: number;//当前月份长度
    let tmpday = new Date();
    let currentday = new Date();

    tmpday.setFullYear(year);
    tmpday.setMonth(month);

    currentday.setFullYear(year);
    currentday.setMonth(month);

    var prev = new Date(tmpday.setDate(0));
    let prevMonthMax = prev.getDate(),//上个月最大日期
        prevMonthLen = prev.getDay();//上一个月长度
    for(let i = prevMonthMax; i > prevMonthMax - prevMonthLen; i--){
      this.prevMonth.push(i);
    }
    this.prevMonth.reverse();

    for(let i = 28; i <= 32; i++){
      let tar = new Date(currentday.setDate(i));
      if(tar.getDate() == 1){
        monthLen = i - 1;
        break;
      };
    }

    for(let i = 1; i <= monthLen; i++){
      this.currentMonth.push(i);
    }

    for(let i = 1; i <= 42 - prevMonthLen - monthLen; i++){
      this.nextMonth.push(i);
    }

    if(this.bindDate){
      this.day = this.bindDate.getFullYear() == this.year && this.bindDate.getMonth() == this.month ? this._day : "";
    }else{
      this.day = "";
    }
  }

  //选择日期
  chooseDate(i){
    if((!!this.startday && i < this.disabledStartDate) || (!!this.endday && i > this.disabledEndDate))return;
    this.day = i;
    this._day = this.day;
    this.choosedDate = `${this.year}-${this.addZero(Number(this.month) + 1)}-${this.addZero(this.day)}`;
    this.bindDate = new Date(this.year, this.month, this.day);
    this.hidePicker();
    this.onChangeCallback(this.format ? moment(this.bindDate).format(this.format) : this.bindDate);
  }

  //去上个月
  toPrevMonth(i?){
    if(!!this.startday){
      if(this.startday.getFullYear() - this.year > 0 || (this.startday.getFullYear() - this.year == 0  && this.startday.getMonth() - this.month >= 0)){
        this.disabledPrevMonth = true;
        return;
      }else{
        this.disabledPrevMonth = false;
      }
    };
    if(this.year <= this.minYear && this.month == 0){//如果超出时间范围无效
      window.alert('超出最小时间范围');
      return false;
    }
    if(this.month == 0){
      this.year -= 1;
      this.month = 11;
    }else{
      this.month -= 1;
    }
    this.getDate(this.year, this.month);
    if(!!i){this.chooseDate(i);}
  }

  //去下个月
  toNextMonth(i?){
    if(!!this.endday){
      if(this.endday.getFullYear() - this.year < 0 || (this.endday.getFullYear() - this.year == 0 && this.endday.getMonth() - this.month <= 0)){
        this.disabledNextMonth = true;
        return;
      }else{
        this.disabledNextMonth = false;
      }
    };
    if(this.year >= this.maxYear && this.month == 11){//如果超出时间范围无效
      window.alert('超出最大时间范围');
      return false;
    }
    if(this.month == 11){
      this.year += 1;
      this.month = 0;
    }else{
      this.month += 1;
    }
    this.getDate(this.year, this.month);
    if(!!i){this.chooseDate(i)};
  }
}
