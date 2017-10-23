import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';


@Component({
  selector: '[tabContent]',
  template: '<ng-content></ng-content>'
})
export class IqTabContentComponent implements OnInit {

  private _display;

  @Input('tabContent') tabContentId: string;

  show() {
    this.ref.nativeElement.style.display = this._display;
  }

  hide() {
    this.ref.nativeElement.style.display = 'none';
  }

  constructor(private ref: ElementRef) { 
    this._display = this.ref.nativeElement.style.display;
  }

  ngOnInit() {
    this.hide();
  }

}