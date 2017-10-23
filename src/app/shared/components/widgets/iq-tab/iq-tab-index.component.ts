import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: '[tabIndex]',
  template: '<ng-content></ng-content>'
})
export class IqTabIndexComponent implements OnInit {

  @Output() onChoose = new EventEmitter();

  @Input('tabIndex') tabId: string;

  @HostListener('click') clickEvent() {
    this.onChoose.emit(this.tabId);
  }

  addClass(v) {
    this.ref.nativeElement.classList.add(v);
  }

  removeClass(v) {
    this.ref.nativeElement.classList.remove(v);
  }

  constructor(private ref: ElementRef) { }

  ngOnInit() {}

}