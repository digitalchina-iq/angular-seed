
/**
导出为core里面所有资源
*/
import { HttpModule, Http, ConnectionBackend, RequestOptions, URLSearchParams, XHRBackend} from '@angular/http';
import { FactoryProvider, ErrorHandler } from "@angular/core";
import { IqHttpService } from "./iq-http.service";

import { HeaderService } from "./header.service";
import { ToolsService } from "./tools.service";
import { CustomSettingService } from "./custom-setting.service";
import { WindowService } from "./window.service";
import { StorageService } from "./storage.service";
import { environment } from 'environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
declare var window;

export class IqErrorHandler implements ErrorHandler {
  constructor(private windowService: WindowService) {

  }
  handleError(error) {
    let _this = this;
    //弹出提示，n秒后跳转
    let alertJump = function(message='',n = 3){
      let second = n;
      let info = { "message": `${message}，${second}秒后跳转`, type: "fail" }
      _this.windowService.alert(info).subscribe(function() {
        //记录当前地址,统一添加iquicker前缀
        window.sessionStorage.setItem("iquicker.historyUrl",window.location.href);
        //执行跳转
        window.location.href = environment["loginPath"];
      });
      Observable.interval(1000).take(second).subscribe(x => {
        let left = second - x -1;
        if (left > 0) {
          info.message =  `${message}，${left}秒后跳转`;
        } else {
          _this.windowService.close();
        }
      })
    }
    let _error = error;
    if (error.rejection) {
      _error = error.rejection;
    }
    if (_error.status == 401) {
      if (environment["loginPath"]) {
        alertJump("未登录");
      } else {
        this.windowService.alert({ "message": "未登录", type: "fail" });
      }
      return
    }
    else if (_error.status == 403) {
      if (environment["loginPath"]) {
        alertJump("没有权限");
      }
      this.windowService.alert({ "message": "未登录", type: "fail" });
      return
    }
    console.error(_error);
    // do something with the exception
  }
}

export function IqErrorHandlerFactory(windowService) {
  return new IqErrorHandler(windowService);
};

export function httpFactory(xhrBackend, requestOptions, windowService) {
  return new IqHttpService(xhrBackend, requestOptions, windowService);
};
export let IqHttpProvider: FactoryProvider =
  { provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, WindowService] };

export let IqErrorHandlerProvider: FactoryProvider =
  { provide: ErrorHandler, useFactory: IqErrorHandlerFactory, deps: [WindowService] };

export { Http, IqHttpService, StorageService, HeaderService, ToolsService, CustomSettingService, WindowService};

export let CORE_PROVIDERS = [IqHttpProvider, StorageService, IqErrorHandlerProvider, HeaderService, ToolsService, CustomSettingService, WindowService];
