import { Component, AfterViewChecked, AfterViewInit,ViewChild,forwardRef,ComponentFactory } from '@angular/core';
import { XcHostDirective } from '../xc-host.directive';
import { XcBaseModal } from '../models/xc-base-modal';
import { XcModalRef } from '../models/xc-modal-ref';
import { XcComponentsLoaderService } from '../services/xc-components-loader.service';

@Component({
  templateUrl: 'xc-modal-container.component.html',
  styleUrls:['xc-modal-container.component.scss']
})
export class XcModalContainerComponent implements AfterViewInit {
  config;
  constructor(private xcComponentsLoaderService:XcComponentsLoaderService){
    this.config = xcComponentsLoaderService.config;
  }
  viewInit:any;
  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    if(this.config.debug){
      if(this.viewInit){
        clearTimeout(this.viewInit);
      }
    }
  }

  @ViewChild(forwardRef(() => XcHostDirective))
  xcHost: XcHostDirective;

  public show = false;

  public init({_componentFactory:componentFactory,data:data}){
    let viewContainerRef = this.xcHost.viewContainerRef;
    let componentRef = viewContainerRef.createComponent(componentFactory);

    //init data
    let modalComponent = componentRef.instance;
    if(data){
      for(let k in data){
        modalComponent[k] = data[k];
      }
    }

    if(this.config.debug){
      this.viewInit = setTimeout(()=>{
        if(console && console.warn){
          console.warn(modalComponent,"this component may not be init well.please check your html");
        }
      },3000);
    }
    return componentRef;
  }
}
