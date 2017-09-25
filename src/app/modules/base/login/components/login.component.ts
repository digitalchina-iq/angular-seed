import { Component } from '@angular/core';
import { Http, URLSearchParams, RequestOptions} from '@angular/http';
import { environment } from 'environments/environment';
import { Base64 } from 'app/utils/base64';
import { WindowService } from 'app/core';

declare var window;

@Component({
  templateUrl: './login.component.html'
  // styleUrls: ['./home.component.scss']
})
export class LoginComponent {
  public user = {
    username:"admin",
    password:"12345678"
  }
  constructor(private httpService:Http, private windowService: WindowService){
  }
  login(){
    let _user = {};
    _user["username"] = this.user.username;
    _user["password"] = Base64.encode(this.user.password);

    this.httpService.post(environment.server+"/login",_user).subscribe(x => {
      //alert("登陆成功！");
      let data = x.json(),
          redirectUrl = window.sessionStorage.getItem("iquicker.historyUrl") || '';
          
      if(data.success){
        window.location.href = redirectUrl;
      }else{
        this.windowService.alert({message: data.message, type: 'fail'});
      }
    })
  }
}
