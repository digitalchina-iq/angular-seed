import { Injectable } from '@angular/core';

export class HeaderConfig{

}

@Injectable()
export class HeaderService {
  private _config = {
    "title":"DCOA",
    "rnav":true,
    "mail_url":"http://dcone.digitalchina.com/dcskip",
    "msg_url":"http://dcone.digitalchina.com/umc/index.jsp?type=app"
  }
  constructor() {  }

  get config(){
    return this._config;
  }
  set config(_config:any){
    Object.assign(this._config,_config);
  }
}
