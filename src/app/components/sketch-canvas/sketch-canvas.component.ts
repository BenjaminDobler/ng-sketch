import {Component, Input, OnInit} from '@angular/core';
import {SketchService} from "../../services/sketch.service";

@Component({
  selector: 'sketch-canvas',
  templateUrl: './sketch-canvas.component.html',
  styleUrls: ['./sketch-canvas.component.css']
})
export class SketchCanvasComponent implements OnInit {
  get rootlayers(): Array<any> {
    return this._rootlayers;
  }

  @Input()
  set rootlayers(value: Array<any>) {
    this._rootlayers = value;
  }


  private _rootlayers: Array<any> = [];

  constructor(private sketchService:SketchService) {
  }

  ngOnInit() {
  }


  getLeftHighlightStyle() {
    if (this.sketchService.highlightedLayer) {
      return this.sketchService.getLayerCoords(this.sketchService.highlightedLayer).x+"px";
    }
    return '0px';
  }

  getTopHighlightStyle() {
    if (this.sketchService.highlightedLayer) {
      return this.sketchService.getLayerCoords(this.sketchService.highlightedLayer).y+"px";
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
