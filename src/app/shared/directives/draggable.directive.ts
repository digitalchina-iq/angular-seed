/**
 *lichen - 2017-12-18
 *可拖动指令
 */
import { Directive, OnInit, Input, Output, ElementRef, HostListener, HostBinding, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'

@Directive({
  selector: '[draggable],[draggableX],[draggableY]'
})
export class DraggableDirective implements OnInit {
  private ele: any;
  private dragSub: Subscription = new Subscription();
  private canDrag: boolean = false;
  private startY: number;
  private startX: number;
  private transition: string;

  @Input() stopDrag: boolean = false;
  @Input() delay: number = 0;//默认延时0毫秒
  @Input() dragabble: boolean = true;
  @Input() dragabbleX: boolean = true;
  @Input() dragabbleY: boolean = true;

  @Output() dragStart = new EventEmitter();
  @Output() dragMove = new EventEmitter();
  @Output() dragEnd = new EventEmitter();

  @HostListener('click', ['$event'])
  onClick(e) {
    if (!this.stopDrag) {
      return false;
    }
  }

  @HostListener('mousedown', ['$event'])
  moveStart(e) {
    if (this.stopDrag) { return }
    this.dragSub = Observable.timer(this.delay).subscribe(() => {
      this.canDrag = true;
      if (!this.dragabble || !this.dragabbleY) {
        this.startY = e.clientY - this.ele.offsetTop;
      }
      if (!this.dragabble || !this.dragabbleX) {
        this.startX = e.clientX - this.ele.offsetLeft;
      }
      this.zIndex = 2;
      this.ele.style.transition = 'none';
      this.dragStart.emit({ dom: this.ele, left: this.ele.offsetLeft, top: this.ele.offsetTop });
    })
  }

  @HostListener('mousemove', ['$event'])
  moveing(e) {
    if (!this.canDrag) {
      return false;
    }

    let top = e.clientY - this.startY,
      left = e.clientX - this.startX;

    if (top < 0) {
      top = 0;
    }
    if (top > this.ele.offsetParent.offsetHeight - this.ele.offsetHeight) {
      top = this.ele.offsetParent.offsetHeight - this.ele.offsetHeight;
    }
    if (left < 0) {
      left = 0;
    }
    if (left > this.ele.offsetParent.offsetWidth - this.ele.offsetWidth) {
      left = this.ele.offsetParent.offsetWidth - this.ele.offsetWidth;
    }

    if (!this.dragabble || !this.dragabbleX) {
      this.ele.style.left = left + 'px';
    }
    if (!this.dragabble || !this.dragabbleY) {
      this.ele.style.top = top + 'px';
    }
    this.dragMove.emit({ dom: this.ele, left: left, top: top });
    return false;
  }

  @HostListener('mouseup')
  moveEnd() {
    this.reset();
  }

  @HostListener('mouseout')
  moveOut() {
    this.reset()
  }

  reset() {
    this.dragSub.unsubscribe();
    if (this.canDrag) {
      this.zIndex = 1;
      this.ele.style.transition = this.transition || '';
      this.dragEnd.emit({ dom: this.ele, left: this.ele.offsetLeft, top: this.ele.offsetTop });
    }
    this.canDrag = false;
  }

  @HostBinding('style.zIndex') zIndex = 1;

  constructor(private el: ElementRef) {
    this.ele = this.el.nativeElement;
  }

  ngOnInit() {
    this.transition = this.ele.style.transition;
    this.ele.style.position = 'absolute';
  }
}