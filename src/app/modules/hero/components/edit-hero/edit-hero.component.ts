import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { WindowService } from 'app/core';
import { XcModalService, XcModalRef } from 'app/shared';

//引入类和服务
import { Query, Hero, HeroListService } from '../../services/hero-list.service';


@Component({
  templateUrl: 'edit-hero.component.html',
  styleUrls:['edit-hero.component.scss']
})
export class EditHeroComponent implements OnInit{
  modal: XcModalRef;
  hero: Hero = new Hero();
  admin: string;//审核人
  formSubmit: boolean;//表单提交
  genderDisabled: boolean;//禁止修改性别

  @ViewChild('form') form: NgForm;//获取表单

  constructor(//依赖注入
    private xcModalService: XcModalService,//动态组件加载服务
    private windowService: WindowService,//提示框
    private heroListService: HeroListService) { }

  ngOnInit() {

    //获得弹出框自身
    this.modal = this.xcModalService.getInstance(this);

    //订阅弹出框出现事件
    this.modal.onShow().subscribe((item?: Hero) => {
      
      if(item) {//判断是新建还是编辑
        //编辑
        this.hero = item;
        this.genderDisabled = true;//禁止修改性别
      } else {
        //新建
        this.hero.country = '';//设置国籍默认下拉值
        this.hero.gender = 0;//设置性别默认值
      }

    })
  }

  /**关闭弹出框*/
  hide(data?: boolean) {
    this.modal.hide(data);

    //重置状态
    this.formSubmit = false;
    this.genderDisabled = false;
    this.form.resetForm();
  }

  /**保存*/
  save() {
    this.formSubmit = true;//表单提交状态为true

    if(this.form.invalid || !this.admin) {return};//如果表单不合法或审核人未选，返回

    this.heroListService.addHero(this.hero).then(data => {
      if(data.success) {
        this.windowService.alert({message: '添加成功', type: 'success'});//提示成功
        this.hide(true);//添加成功关闭弹出框，传值true，在列表页刷新列表
      } else {
        this.windowService.alert({message: data.message, type: 'fail'});//失败提示
      }
    })
  }

}