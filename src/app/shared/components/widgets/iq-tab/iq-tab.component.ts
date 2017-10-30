import { Component, OnInit, Input, QueryList, ContentChildren } from '@angular/core';

import { IqTabIndexComponent } from './iq-tab-index.component';
import { IqTabContentComponent } from './iq-tab-content.component';

@Component({
  selector: 'iq-tab',
  template: '<ng-content></ng-content>'
})
export class IqTabComponent implements OnInit {

  length: number;

  @Input() tabActiveClass: string;
  @Input() tabActiveIndex: string;

  @ContentChildren(IqTabIndexComponent) indexList: QueryList<IqTabIndexComponent>;
  @ContentChildren(IqTabContentComponent) contentList: QueryList<IqTabContentComponent>;

  constructor() {}

  ngOnInit() {}

  tabInit() {
    let indexList = this.indexList.filter(item => this.tabActiveIndex === item.tabId),
        contentList = this.contentList.filter(item => item.tabContentId === this.tabActiveIndex);

    if(!this.tabActiveIndex || !indexList.length){

      if(!this.indexList.first || !this.contentList.first){return};

      this.indexList.first.addClass(this.tabActiveClass);
      this.contentList.first.show();

    }else{

      indexList.forEach(item => item.addClass(this.tabActiveClass));
      contentList.forEach(item => item.show());
    }
  }

  contentInit() {
    this.length = this.indexList.length;

    this.indexList.forEach(item => {

      item.onChoose.subscribe(v => {
        this.tabActiveIndex = v;

        this.indexList.forEach(item => {
          item.removeClass(this.tabActiveClass);

          if(this.tabActiveIndex === item.tabId){
            item.addClass(this.tabActiveClass);
          }

        })
        this.contentList.filter(item => {
          item.hide();
          return item.tabContentId === this.tabActiveIndex
        }).forEach(item => {
          item.show();
        })
        
      })
    });

  }

  ngAfterContentInit() {
    
    this.tabInit();

    this.contentInit();
  }

  ngAfterContentChecked() {
    if(this.length !== this.indexList.length){

      if(this.length > this.indexList.length){
        this.tabInit();
      }

      this.contentInit();
    }
  }

}