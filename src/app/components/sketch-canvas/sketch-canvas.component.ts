import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {SketchService} from "../../services/sketch.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'sketch-canvas',
  templateUrl: './sketch-canvas.component.html',
  styleUrls: ['./sketch-canvas.component.css']
})
export class SketchCanvasComponent implements OnInit, AfterViewInit {



  @Input()
  set svgData(value:any) {
    this._svgData = value;
    if (this.inited) {
      this.updateSVGContent();
    }
  }

  private _svgData:any;
  public inited:boolean = false;


  get rootlayers(): Array<any> {
    return this._rootlayers;
  }


  @Input()
  set rootlayers(value: Array<any>) {
    this._rootlayers = value;
  }

  @ViewChild('ref')
  public ref:ElementRef;

  private _rootlayers: Array<any> = [];

  constructor(private sketchService:SketchService, private sanitizer: DomSanitizer) {
  }

  ngAfterViewInit(): void {
    this.inited = true;
    this.updateSVGContent();
  }

  ngOnInit() {
  }

  updateSVGContent() {
    if (this.ref) {
      this.ref.nativeElement.innerHTML = '<svg height="3000" width="3000" fill="#fff" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >'+this._svgData+'</svg>';
    }
  }


  getLeftHighlightStyle() {
    if (this.sketchService.highlightedLayer) {
     // return this.sketchService.getLayerCoords(this.sketchService.highlightedLayer).x+"px";
    }
    return '0px';
  }

  getTopHighlightStyle() {
    if (this.sketchService.highlightedLayer) {
      //return this.sketchService.getLayerCoords(this.sketchService.highlightedLayer).y+"px";
    }
    return '0px';
  }

  getWidthHighlightStyle() {
    if (this.sketchService.highlightedLayer) {
      return this.sketchService.highlightedLayer.frame.width+'px';
    }
    return '0px';
  }

  getHeightHighlightStyle() {
    if (this.sketchService.highlightedLayer) {
      return this.sketchService.highlightedLayer.frame.height+'px';
    }
    return '0px';
  }

}
