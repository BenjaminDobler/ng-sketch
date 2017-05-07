import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {DragAndDropUtil} from "../utils/drag-drop.util";
import {Sketch2Svg} from "../../services/sketch2svg";
import {SketchService} from "../../services/sketch.service";

@Component({
  selector: 'sketch-info',
  templateUrl: './sketch-info.component.html',
  styleUrls: ['./sketch-info.component.css']
})
export class SketchInfoComponent implements OnInit {


  svgConverter: Sketch2Svg;

  get selected(): string {
    return this._selected;
  }

  set selected(value: string) {
    this._selected = value;
  }

  @Input()
  selectedLayer: any;

  private _selected: string = 'JSON';

  constructor(private el: ElementRef, private sketchService: SketchService) {
    this.svgConverter = new Sketch2Svg();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const dd: DragAndDropUtil = new DragAndDropUtil(this.el.nativeElement);
    let startWidth: number = this.el.nativeElement.clientWidth;
    dd.mousedown.subscribe(() => {
      startWidth = this.el.nativeElement.clientWidth;
    });
    dd.mousedrag.subscribe((e: any) => {
      console.log(e);
      let newWidth = startWidth - e.deltaX;
      this.el.nativeElement.style.width = newWidth + 'px';
    });
  }

  getSelectedLayer() {
    return JSON.stringify(this.selectedLayer, null, 4);

  }

  getSVG() {
    if (this.selectedLayer) {
      return this.svgConverter.convert(this.selectedLayer, this.sketchService);
    }
  }

}
