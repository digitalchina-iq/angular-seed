import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[trim],textarea[trim]'
})
export class TrimDirective {

  constructor(private ref: ElementRef) {}

  @HostListener('input') inputEvent() {
    let reg = new RegExp(/\s/, 'g');
    this.ref.nativeElement.value = this.ref.nativeElement.value.replace(reg,'');
  }

}