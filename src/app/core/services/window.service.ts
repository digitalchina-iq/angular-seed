import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';

//alert弹窗配置接口
interface Config {
  autoClose?: boolean;//是否自动关闭
  closeTime?: number;//自动关闭的毫秒数
}


@Injectable()
export class WindowService {
  /**{
   *    autoClose: 是否自动关闭，默认true
   *    closeTime: 自动关闭毫秒数，默认3000
   *}
   */
  config: Config = {autoClose: true, closeTime: 3000};

  private subscriber: Subscription = new Subscription();
  private _windowSubject;
  private _closeSubject;
  constructor() {
    this._windowSubject = new Subject();
  }
  //关闭的subject，方便关闭之后回调
  get closeSubject() {
    return this._closeSubject;
  }
  //弹出服务的内部subject
  get windowSubject() {
    return this._windowSubject;
  }
  show(param) {
    if (this._closeSubject) {
      return this._closeSubject;
    }
    this._closeSubject = new Subject();
    this._closeSubject.subscribe(() => {
      //延迟，如果有其他订阅者，先执行其他订阅者方法，再complete
      setTimeout(()=>{
        this._closeSubject.complete();
        this._closeSubject = null;
      });
    })
    this._windowSubject.next(param);
    return this._closeSubject;
  }
  close(v?) {
    this.subscriber.unsubscribe();
    if (this._closeSubject) {
      this._closeSubject.next(v);
    }
  }

  /**
   *alert调用
   *@param {message: string, type: string} p - 弹出框信息
   *@param {Config} config - 配置，可选参数
   * - autoClose: 是否自动关闭，默认true
   * - closeTime: 自动关闭毫秒数，默认3000
   */
  alert(p, config?: Config): Observable<any> {
    if(this._closeSubject) {
      return this._closeSubject;
    }

    config = Object.assign({}, this.config, config);

    let reg = /[\S\s]*#\{(\d+)\}[\s\S]*/;
    let msg = p.message;
    let n = Number(msg.replace(reg, '$1'));

    if(reg.test(msg)) {

      if(isNaN(n)) {
        console.error('#{n}中，n必须为正整数数字');
        return;
      }

      p.message = msg.replace(/#\{\d+\}/, n);

      this.subscriber = Observable.interval(1000).take(n).subscribe(v => {
        if (v < n - 1) {
          p.message =  msg.replace(/#\{\d+\}/, n - 1 - v);
        } else {
          this.close();
        }
      });
    } else {
      this.subscriber = Observable.timer(config.closeTime).subscribe(() => {
        this.close();
      })
    }

    if(!config.autoClose) {
      this.subscriber.unsubscribe();
    }

    return this.show({
      type: "alert",
      option: p
    });
  }
  //确认 调用
  confirm(p): Observable<any> {
    this.subscriber.unsubscribe();
    return this.show({
      type: "confirm",
      option: p
    });
  }
  //prompt调用
  prompt(p): Observable<any> {
    this.subscriber.unsubscribe();
    return this.show({
      type: "prompt",
      option: p
    });
  }
}
