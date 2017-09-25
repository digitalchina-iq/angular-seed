import { Component,OnInit,OnChanges,Input} from '@angular/core';
import { Person } from 'app/shared/services/person.service';

import { PersonAPIConfig } from 'environments/environment';

@Component({
  selector: 'user-image-head',
  templateUrl: 'user-image-head.component.html'
})
export class UserImageHeadComponent implements OnInit ,OnChanges{
  constructor() {  }
  @Input() url:string;
  @Input() user:Person;

  // 颜色数组
  private colors = [
    '#63d5e6',
    '#74dcc5',
    '#6ec1fb',
    '#5dc9f9',
    '#f690a1',
    '#ff9e57'
  ];
  //头像（图片）所在背景色
  private color = '';
  initData = ()=> {
    if(this.user && this.user.userID){
      let id = this.user.userID.toString();
      let url = PersonAPIConfig.userImagePattern;
      if(!this.url){
        let matchers = url.match(/\{\{(\w+)\}\}/g);
        this.url = url;
        matchers.forEach(k=>{
          this.url = this.url.replace(new RegExp(k,"g"),k.substring(2,k.length-2));
        })
      }
      // 没有头像（图片）时，背景颜色
      let _index = Number.parseInt(''+id.charCodeAt(id.length-1)) % 6;
      this.color = this.colors[_index];
    }else{
      this.user = new Person();
      this.user.userCN = "匿名";
      this.color = this.colors[0];
    }
  }
  ngOnChanges(){
    // console.log(1);
    this.initData();
  }
  ngOnInit(){
    this.initData();
  }
}
