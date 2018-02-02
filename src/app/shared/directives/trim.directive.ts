import { Directive, HostListener, Optional } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: 'input[trim],textarea[trim]'
})
export class TrimDirective {

  constructor(@Optional() private ng: NgModel) {}

  @HostListener('input', ['$event.target', '$event.target.value']) inputEvent(ele, v: string) {
    ele.value = v.replace(/\s/g,'');
    if(this.ng){
      this.ng.reset(ele.value);
    }
  }

}