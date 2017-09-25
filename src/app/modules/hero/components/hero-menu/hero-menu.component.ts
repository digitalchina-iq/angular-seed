import { Component } from '@angular/core';

@Component({
  templateUrl: './hero-menu.component.html',
  styleUrls: ['./hero-menu.component.scss']
})
export class HeroMenuComponent {
  
  status: number;

  constructor() { }

  toggle(e){
    this.status = e;
  }
}