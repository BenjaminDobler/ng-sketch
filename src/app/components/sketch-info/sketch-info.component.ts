import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {DragAndDropUtil} from '../utils/drag-drop.util';
import {SketchService} from '../../services/sketch.service';

@Component({
  selector: 'sketch-info',
  templateUrl: './sketch-info.component.html',
  styleUrls: ['./sketch-info.component.css']
})
export class SketchInfoComponent implements OnInit {


  get selected(): string {
    return this._selected;
  }

  set selected(value: string) {
    this._selected = value;
  }

  @Input()
  selectedLayer: any;

  private _selected = 'JSON';

  constructor(private el: ElementRef, private sketchService: SketchService) {
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
      const newWidth = startWidth - e.deltaX;
      this.el.nativeElement.style.width = newWidth + 'px';
    });
  }

  getSelectedLayer() {
    return JSON.stringify(this.selectedLayer, null, 4);

  }


  getSelectedSvgSymbol() {
    if (this.sketchService.selectedSymbolId) {
      return this.sketchService.selectedDocument.getLayerSymbol(this.sketchService.selectedSymbolId);
    } else {
      return '<svg></svg>';
    }

  }


}
