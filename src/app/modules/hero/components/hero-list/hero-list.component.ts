import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//引入公共类
import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef } from 'app/shared';
//引入类和服务
import { Query, Hero, HeroListService } from '../../services/hero-list.service';
//引入弹出框组件
import { EditHeroComponent } from '../edit-hero/edit-hero.component';

/**英雄列表组件*/
@Component({
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})
export class HeroListComponent implements OnInit {

  fullChecked = false;//全选状态
  indeterminate = false;//半选状态
  checkedNum = 0;//已选项数
  loading: boolean = true;//加载中效果
  pagerData: Pager = new Pager();//分页数据对象
  isSearch: boolean = false;//是否为搜索结果
  heroList: Hero[] = [];//英雄列表
  query: Query = new Query();//查询对象
  modal: XcModalRef;//弹出框模型
  heroImportApi: string;//文件上传api
  private _gender: number = 0;//保存查询状态

  constructor(
    private router: Router,
    private heroListService: HeroListService,
    private xcModalService: XcModalService,
    private windowService: WindowService){}

  /**组件初始化*/
  ngOnInit() {
    //获取弹出框组件模型
    this.modal = this.xcModalService.createModal(EditHeroComponent);
    //订阅弹出框关闭事件
    this.modal.onHide().subscribe((flag?: boolean) => {
      if(flag){//如果成功则刷新数据
        this.reset();
        this.initData(this.query);
      }
    });

    //获取文件上传api
    this.heroImportApi = this.heroListService.getHeroImportApi();
  }

  /**初始化数据，获取英雄列表*/
  initData(query: Query) {
    this.loading = true;//加载数据时显示loading效果
    this.heroListService.getHeroList(query).then(data => {
      this.loading = false;
      this.fullChecked = false;//全选状态重置
      this.indeterminate = false;//半选状态重置
      if(data.success){
        this.heroList = data.list;
        this.pagerData.set(data.pager);//设置分页器
      }else{
        this.windowService.alert({message: data.message, type: 'fail'});//失败提示
      }
    })
  }

  /**状态栏切换*/
  toggle(e: number) {
    
    if(e !== this._gender) {
      this._gender = e;
      this.query = new Query();
      this.query.gender = e;
      this.initData(this.query);//如果切换成功，刷新列表
    };
  }

  /**分页器change事件*/
  onChangePager(e: Pager) {
    this.query.pageNo = e.pageNo;
    this.query.pageSize = e.pageSize;

    this.initData(this.query);
  }

  /**搜索*/
  search() {
    this.isSearch = true;//标记结果为搜索结果
    this.query.pageNo = 1;//搜索时将页码置为1
    this.initData(this.query);
  }

  /**重置*/
  reset() {
    this.query = new Query();
    this.query.gender = this._gender;
  }

  /**新添加英雄*/
  addHero() {
    this.modal.show();//弹出框出现
  }

  /**导入文件成功*/
  fileUploadSuccess(data) {
    //假设返回的数据为：{message: '上传成功', success: true, status: 200}
    /*if(data.success){
      this.initData(this.query);//上传成功刷新页面
    }*/
  }

  /**编辑英雄*/
  editHero(item: Hero) {
    this.modal.show(JSON.parse(JSON.stringify(item)));//弹出框出现，并传入英雄数据
  }
  
  /**删除英雄*/
  deleteHero(param: Hero[]|string) {
    //请求完成的回调函数
    let callback = (data) => {
      if(data.success){
        this.windowService.alert({message: '删除成功', type: 'success'});//提示成功
        this.initData(this.query);//请求成功刷新数据
      }else{
        this.windowService.alert({message: data.message, type: 'fail'});//失败提示
      }
    };


    if(typeof param == 'string'){//删除单条数据
      this.windowService.confirm({message: '确定删除该条数据？'}).subscribe(v => {
        if(v){
          //如果点击确定，执行此步
          this.heroListService.deleteHero(param).then(callback);
        }
      })
    }else{//删除多条数据
      this.windowService.confirm({message: `确定删除您选中的${this.checkedNum}条数据？`}).subscribe(v => {
        if(v){
          //过滤出选中项，并发送请求，如果接口能接收数组，则不需要循环
          this.heroList.filter(item => item.checked).forEach(item => {
            this.heroListService.deleteHero(item.id).then(callback);
          });
        }
      })
    }
  }

  /**展示英雄详情*/
  showHeroDetail(id: string) {
    this.router.navigate(['hero/detail',id]);//导航到英雄详情
  }
}
