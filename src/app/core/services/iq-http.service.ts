import { Injectable } from '@angular/core';
import { Http,URLSearchParams,
  RequestOptionsArgs,
  ConnectionBackend, RequestOptions, XHRBackend } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { WindowService } from "./window.service"

export { URLSearchParams ,RequestOptions};
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';

@Injectable()
export class IqHttpService extends Http {
  constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions,private windowService:WindowService){
    super(_backend,_defaultOptions);
  }
  responseFilter(x){
    let flag = true;
    if(x.status == 200){
      let resbody = x.json();
      if(resbody.status === undefined){
        return true;
      }
      if(resbody.status == 200){
        flag = true;
      }
      else if(resbody.status == 4041){
        let x = {"message":"数据错误,5秒后刷新页面",type:"fail"};
        this.windowService.alert(x);

        Observable.interval(1000).take(5).subscribe(
          i => x.message = "数据错误,"+(4-i)+"秒后刷新页面",
          null, () => location.href = location.href);
      }else{
        flag = true;
      }
    }
    return flag;
  }
  get(url: string, options?: RequestOptionsArgs){
    let _options:RequestOptionsArgs;

    if(options){
      //复制出新对象进行修改参数值,添加请求时间戳
      _options = options;
      if(_options["search"]){
        let searchParam = _options["search"];
        if(typeof searchParam === 'string'){
          _options["search"] = new URLSearchParams(searchParam);
        }else if(searchParam instanceof URLSearchParams){
          let t = new Date().getTime();
          if(searchParam.has("m")){
            searchParam.set("m"+t,""+t);
          }else{
            searchParam.set("m",""+t);
          }
        }
      }else{
        _options["search"] = new URLSearchParams("m="+new Date().getTime());
      }
    }else{
      _options = new RequestOptions({
        search: new URLSearchParams("m="+new Date().getTime())
      });
      // _options["search"] = JSON.parse(JSON.stringify({m:new Date().getTime()}));
    }
    return super.get(url,_options).filter(this.responseFilter);
  }

  post(url: string, body: any, options?: RequestOptionsArgs) {
    return super.post(url,body,options).filter(this.responseFilter);
  }
  put(url: string, body: any, options?: RequestOptionsArgs) {
    return super.put(url,body,options).filter(this.responseFilter);
  }
  delete(url: string, options?: RequestOptionsArgs) {
    return super.delete(url,options).filter(this.responseFilter);
  }

}
