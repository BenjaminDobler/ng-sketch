import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';


export class DragAndDropUtil {

  mouseup: Observable<any>;
  mousemove: Observable<any>;
  mousedown: Observable<any>;
  mousedrag: Observable<any>;


  constructor(dragTarget: any) {
    let w: any = window;
    let up: string = 'pointerup';
    let move: string = 'pointermove';
    let down: string = 'pointerdown';
    let downX:number = 0;
    let downY:number = 0;


    //if (!w.PointerEvent) {
    if ('ontouchstart' in w ||
      w.DocumentTouch && document instanceof w.DocumentTouch ||
      navigator.maxTouchPoints > 0 ||
      w.navigator.msMaxTouchPoints > 0) {
      up = 'touchend';
      move = 'touchmove';
      down = 'touchstart';
      console.log("Use Touch!")
    } else {
      up = 'mouseup';
      move = 'mousemove';
      down = 'mousedown';
      console.log("Use mouse")
    }
    //}


    this.mouseup = Observable.fromEvent(document, up);
    this.mousemove = Observable.fromEvent(document, move);
    this.mousedown = Observable.fromEvent(dragTarget, down);
    this.mousedrag = this.mousedown.mergeMap((md: any) => {
      let startX: number;
      let startY: number;
      if (md.touches) {
        console.log("Touch ", md.touches[0]);
        var rect = dragTarget.getBoundingClientRect();
        startX = md.touches[0].pageX - rect.left;
        startY = md.touches[0].pageY - rect.top;
        downX = md.touches[0].clientX;
        downY = md.touches[0].clientY;

      } else {
        startX = md.offsetX;
        startY = md.offsetY;
        downX = md.clientX;
        downY = md.clientY;
      }
      return this.mousemove.map((mm: any) => {
        mm.preventDefault();

        if (mm.touches) {
          mm = mm.touches[0];
        }
        return {
          left: mm.clientX - startX,
          top: mm.clientY - startY,
          deltaX: mm.clientX - downX,
          deltaY: mm.clientY - downY
        };
      }).takeUntil(this.mouseup);
    });
  }
}
