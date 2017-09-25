
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable, ComponentFactory,Type, Optional,FactoryProvider,ComponentFactoryResolver} from '@angular/core';

let staticSubject = new Subject();

import {XcModalRef} from "../models/xc-modal-ref";
/**
由于每个 懒加载模块有自己的componentFactoryResolver，所以这个服务也得放到每个模块去自行生成实例
*/
@Injectable()
export class XcComponentsLoaderService {
  public componentsSubject: Subject<XcModalRef>;

  public modalList:XcModalRef[] = [];

  //通用配置
  private _config;

  get config():any{
    return this._config;
  }
  set config({debug:flag}){
    this._config.debug = flag;
  }

  constructor(private componentFactoryResolver:ComponentFactoryResolver) {
    this.componentsSubject = staticSubject;
    this._config = {
      debug:false
    };
  }


  // destroy(xcModalRef){
  //   let _index = this.modalList.indexOf(xcModalRef);
  //   this.modalList.splice(_index,1,0);
  // }

  /**
  隐藏所有
  */
  hideAll(){
    this.modalList.forEach(function(k,v){
      if(k.destroyed === false && k.isOpen === true){
        k.hide();
      }
    })
  }
  /**
    destroy all opened modal;
  */
  destroyAll(){
    this.modalList.forEach(function(k,v){
      if(k.destroyed === false){
        k.destroy();
      }
    })
    this.modalList.length = 0;
  }
  addComponent(component:Type<any>,data:any){
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    let modal = new XcModalRef(componentFactory);
    modal.data = data;
    this.modalList.push(modal);
    this.componentsSubject.next(modal);
    return modal;
  }
}
