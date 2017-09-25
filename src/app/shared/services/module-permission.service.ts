import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/from';
import 'rxjs/observable/from';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from 'environments/environment';

const LIMIT_TIME = 5 * 60 * 1000; // 保留5分钟

const URL_MATCHER = new RegExp("^\\w[^\\\\/]*$");

const REQUEST_URL = environment.server + "is-permitted-all/";

@Injectable()
export class ModulePermissionService {
  constructor(private http: Http) { }

  //根据参数判断是否是管理员
  //param  permission  eg : card:systemSetting
  getModulePermission(permission: string) {
    return this.http.get(environment.server + "is-permitted-all/" + permission)
      .toPromise()
      .then(response => response.json());
  }


  permissionMap = {};

  /**
   * 请求权限，如果有在请求的权限，返回之前请求的Observable 如果超时、没有请求，请求后台，返回请求的Observable
   */
  private requestPermission(one): Observable<boolean> {
    if (!(one && typeof one == "string" && URL_MATCHER.test(one))) {
      environment.production ? null : console.error("input error,must be string");
      return Observable.empty();
    }
    var _p = this.permissionMap[one]; // perimission对象
    if (_p) {
      if (_p["request"]) { // 在请求时间内，返回请求的 对象
        return _p["request"];
      } else if (_p["timeStamp"] > new Date().getTime() - LIMIT_TIME) {
        // 在缓存时间内，直接返回
        return Observable.from([_p["value"]]);
      }
    }
    let requestSubject = new Subject();
    // 没有有效的permission，请求后台
    this.http.get(REQUEST_URL + one).map((response) => {
      let v = response.json()
      if (v === "true" || v === true) {
        this.permissionMap[one] = {
          "timeStamp": new Date(),
          "value": true
        }
      } else {
        this.permissionMap[one] = {
          "timeStamp": new Date(),
          "value": false
        }
      }
      return v;
    }).catch(() => {
      /*错误处理,如果请求失败 认为没权限*/
      this.permissionMap[one] = {};
      return Observable.from([false]);
    }).subscribe((x) => {
      requestSubject.next(x);
      requestSubject.complete();
    },
      (x) => {
        requestSubject.next(false);
        requestSubject.complete();
      });
    this.permissionMap[one] = {
      "request": requestSubject
    };
    return requestSubject;
  }

  has(one) {
    return this.requestPermission(one);
  }
  hasAll(list) {
    if (list instanceof Array) { // 必须传入数组类型
      let obList = [];
      list.forEach((k, i) => {
        obList.push(this.requestPermission(k));
      })
      return Observable.merge.apply(null, obList).first((v) => {
        return !v;
      }).catch(() => {
        /*如果为空了，则表明全部都匹配*/
        return Observable.from([true]);
      })
    } else {
      environment.production ? null : console.error("input error,must be array");
      return Observable.empty();
    }
  }
  hasAny(list) {
    if (list instanceof Array) { // 必须传入数组类型
      let obList = [];
      list.forEach((k, i) => {
        obList.push(this.requestPermission(k));
      })
      return Observable.merge.apply(null, obList).first((v) => {
        return v;
      }).catch(() => {
        /*错误处理，如果请求完了，还没有一个true，将错误拦截，返回没有权限*/
        return Observable.from([false]);
      });
    } else {
      environment.production ? null : console.error("input error,must be array");
      return Observable.empty();
    }
  }



}
