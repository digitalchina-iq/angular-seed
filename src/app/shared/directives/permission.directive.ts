import { Directive, Input, ElementRef, OnInit} from '@angular/core';
import { ModulePermissionService } from 'app/shared/services/module-permission.service';

/**
iq permission 指令，权限判断
*/
@Directive({ selector: '[iq-permission]' })
export class IqPermissionDirective implements OnInit {

  constructor(private el: ElementRef, private modulePermissionService: ModulePermissionService) {
  }
  show = true;//初始为true 在 init里面隐藏
  styleDisplay;
  _p = ""
  option = {
    mode: "has",//默认has,完全匹配字符串 还有hasAll匹配所有 ，hasAny有一即可
    reverse: false,//反转 有权限则返回false 没有返回true
    separator: ";" //分隔符 如果permission是字符串，且mode是hasAll或hasAny的时候，将字符串分割成字符串数组
  }
  @Input('iq-permission')
  set permission(p) {
    if (this._p != p) {
      this._p = p;
    }
    this.requestPermission(this._p);
  }
  @Input('permissionOption')
  set permissionOption(option) {
    Object.assign(this.option, option);
    this.requestPermission(this._p);
  }
  ngOnInit(){
    this.hideEl();
  }
  //隐藏元素
  hideEl() {
    if (this.show) {
      this.styleDisplay = this.el.nativeElement.style.display;
      this.el.nativeElement.style.display = "none";
      this.show = false;
    }
  }
  //显示元素
  showEl() {
    if (!this.show) {
      this.el.nativeElement.style.display = this.styleDisplay;
      this.show = true;
    }
  }
  requestPermission(permission) {
    let fn;
    let p: string | Array<string>;

    if(this.option.reverse){
      this.showEl();
    }else{
      this.hideEl();
    }
    if(!permission){
      return
    }
    if (this.option.mode == "hasAny") {
      fn = this.modulePermissionService.hasAny;

      if(typeof permission == "string"){
        p = permission.split(this.option.separator);
      }
      else p = permission;
    }
    else if (this.option.mode == "hasAll") {
      fn = this.modulePermissionService.hasAll;

      if(typeof permission == "string"){
        p = permission.split(this.option.separator);
      }
      else p = permission;
    }
    else {
      fn = this.modulePermissionService.has;
      p = permission;
    }
    fn.call(this.modulePermissionService, p).subscribe((flag)=>{
      if(flag != this.option.reverse){
        this.showEl();
      }else{
        this.hideEl();
      }
    });
  }
}
