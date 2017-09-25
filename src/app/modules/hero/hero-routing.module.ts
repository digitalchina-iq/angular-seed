import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//导入公共组件
import {
  HeaderComponent, 
  IqTlrFrameComponent,
  IqTbFrameComponent 
} from 'app/shared/components/index';

//导入该模块的Component（组件）
import {
  HeroMenuComponent, 
  HeroListComponent,
  HeroDetailComponent
} from './components/index';

const routes: Routes = [//定义路由配置
  {
    path: '', component: IqTlrFrameComponent,//上左右结构
    children: [
      { path: '', redirectTo: 'list' },//重定向到 默认页面
      { path: '', component: HeroMenuComponent, outlet: 'left' },//左侧
      { path: 'list', data: {'breadcrumb': '英雄列表'}, component: HeroListComponent }//根据路径激活相应组件
    ]
  },
  {
    path: '', component: IqTbFrameComponent,//上下结构
    children: [
      { path: 'detail/:id', component: HeroDetailComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)//RouterModule静态方法forChild定义路由配置
  ],
  exports: [RouterModule]//用来控制将哪些内部成员暴露给外部使用
})
export class HeroRoutingModule { }