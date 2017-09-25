import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/merge';

declare var window;


@Injectable()
export class StorageService {

  listener = { "": new Subject<any>() };

  private triggerEvent(e){
    let listener = this.listener;
    listener[""].next(e);
    if (e.key) {
      //冒泡，级联事件
      let tmp = e.key;
      do {
        if (listener[tmp]) {
          listener[tmp].next(e);
        }
        tmp = tmp.substring(0, tmp.lastIndexOf("/"))
      }
      while (tmp.lastIndexOf("/") > -1);
    }
  }
  constructor() {
    let t = this;
    window.addEventListener('storage', function(e) {
      t.triggerEvent.call(t,e)
    });
  }

  setItem(key, value) {
    let v = this.getItem(key);
    window.localStorage.setItem(key, value);
    if (v != value) {
      //StorageEvent 暂时无法new。模拟一个这个对象
      let e = {
        "key":key,
        "newValue":value,
        "oldValue":v,
        "returnValue":true,
        "storageArea":window.localStorage,
        "target":window,
        "type":"storage"
      };
      this.triggerEvent(e);
    }
  }
  getItem(key) {
    return window.localStorage.getItem(key);
  }

  removeItem(key) {
    return window.localStorage.removeItem(key);
  }
  onChange(target: string | Array<string>, fullmatch = false): Observable<any> {
    let generalOb = t => {
      if (!this.listener[t]) {
        this.listener[t] = new Subject<any>();
      }
      if (fullmatch) {//完全匹配，target必须是自己才触发
        return this.listener[t].filter(e => {
          if (e.key == t) {
            return true;
          } else {
            return false;
          }
        });
      }else {//只要涉及到，就修改
        return this.listener[t];
      }
    }
    if (!target) {
      return this.listener[""];
    }
    if (typeof target == "string") {
      //创建subject
      return generalOb(target);
    } else {
      let list = [];
      target.forEach((k, v) => {
        list.push(generalOb(k));
      });
      //延迟300毫秒，有多重变化只触发一次
      return Observable.merge.apply(null, list).debounceTime(300);
    }
  }
}
