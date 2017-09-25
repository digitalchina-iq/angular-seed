//导入相应模块
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HeroRoutingModule } from './hero-routing.module';

import { HERO_COMPONENTS, HERO_ENTRY_COMPONENTS } from './components/index';
import { HERO_SERVICES } from './services/index';
import { HERO_PIPES } from './pipes/index';

//@NgModule装饰器用来为模块定义元数据
@NgModule({
  imports: [//导入其他module，其它module暴露的出的Components、Directives、Pipes等可以在本module的组件中被使用
    SharedModule,//shared模块
    HeroRoutingModule//hero路由模块
  ],
  declarations: [//声明模块内部组件、指令、管道
    HERO_COMPONENTS,//hero组件
    HERO_PIPES//hero管道
  ],
  entryComponents: [HERO_ENTRY_COMPONENTS],
  providers:[//指定模块提供商
    HERO_SERVICES//hero服务
  ]
})
export class HeroModule { }//导出HeroModule
