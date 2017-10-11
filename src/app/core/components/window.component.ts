import { Component, OnInit, ViewChild } from '@angular/core';
import { WindowService } from '../services/index';
import { ModalDirective } from 'ngx-bootstrap/modal';

export class Option {
  type: string
  message: string
}
@Component({
  selector: 'alert-confirm',
  templateUrl: 'window.component.html'
})
export class WindowComponent implements OnInit {
  @ViewChild('confirmModal') public confirmModal: ModalDirective
  @ViewChild('alertModal') public alertModal: ModalDirective
  @ViewChild('promptModal') public promptModal: ModalDirective
  constructor(private windowService: WindowService) { };
  options = new Option();
  promptvalue: string = "";

  hideDialog(v?) {
    this.windowService.close(v);
    this.promptvalue = "";
  }
  stopClick(e) {
    e.stopPropagation();
  }
  ngOnInit() {
    this.windowService.windowSubject
      .subscribe(({"type": type, "option": p}) => {
        this.options = p;
        if (type === "alert") {
          this.alertModal.show();
        } else if (type === "confirm") {
          this.confirmModal.show();
        }else{
          this.promptModal.show();
        }
        this.windowService.closeSubject.subscribe(()=>{
          this.alertModal.hide();
          this.confirmModal.hide();
          this.promptModal.hide();
        })
      })
  }
}
