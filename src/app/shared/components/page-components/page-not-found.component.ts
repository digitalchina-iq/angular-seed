import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `<div>
    <h2>页面不见了</h2>
    <p (click)="returnHome()" style="color: #57b9f8;cursor: pointer;">点此返回首页</p>
  </div>`
})
export class PageNotFoundComponent {

  constructor(private router: Router) { }
  
  returnHome(){
    this.router.navigate(['']);
  }
}
