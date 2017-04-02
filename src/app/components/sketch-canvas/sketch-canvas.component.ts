import {Component, Input, OnInit} from '@angular/core';

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
    console.log("Root Layers changed ", value)
    this._rootlayers = value;
  }


  private _rootlayers: Array<any> = [];

  constructor() {
  }

  ngOnInit() {
  }

}
