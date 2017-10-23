import { Component, OnInit, Input, QueryList, ContentChildren } from '@angular/core';

import { IqTabIndexComponent } from './iq-tab-index.component';
import { IqTabContentComponent } from './iq-tab-content.component';

@Component({
  selector: 'iq-tab',
  template: '<ng-content></ng-content>'
})
export class IqTabComponent implements OnInit {

  @Input() tabActiveClass: string;
  @Input() tabActiveIndex: string;

  @ContentChildren(IqTabIndexComponent) indexList: QueryList<IqTabIndexComponent>;
  @ContentChildren(IqTabContentComponent) contentList: QueryList<IqTabContentComponent>;

  constructor() {}

  ngAfterContentInit() {
    if(!this.tabActiveIndex){
      this.indexList.first.addClass(this.tabActiveClass);
      this.contentList.first.show();
    }else{
      this.indexList.filter(item => this.tabActiveIndex === item.tabId).forEach(item => item.addClass(this.tabActiveClass));
      this.contentList.filter(item => item.tabContentId === this.tabActiveIndex).forEach(item => item.show());
    }

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

  ngOnInit() {}

}