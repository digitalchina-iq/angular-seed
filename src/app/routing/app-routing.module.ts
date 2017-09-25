import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  PageErrorComponent,
  PageNotFoundComponent,
  HeaderComponent, 
  IqTlrFrameComponent,
  IqTbFrameComponent 
} from 'app/shared/components/index';
//必须在引入shared components之后 不知道为啥
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  { path: '', data: {'breadcrumb': '首页'}, component: IqTbFrameComponent },
  {
    path: 'login', data: {'breadcrumb': '登陆'},
    loadChildren: "app/modules/base/login/login.module#LoginModule"
  },
  {
    path: 'hero', data: {'breadcrumb': '英雄'},
    loadChildren: 'app/modules/hero/hero.module#HeroModule'
  },
  { path: '500', component: PageErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
