import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SketchService} from "../../services/sketch.service";


@Component({
  selector: '[layer]',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {


  @Input()
  public index;

  @Input()
  public parent;


  @Input()
  public set data(value: any) {
    this._data = value;
  }

  public get data() {
    return this._data;
  }

  private _data: any;


  constructor(private sketchService: SketchService) {
  }

  ngOnInit() {
  }

  getSymbol(layer) {
    console.log("Symbol Map ", this.sketchService.symbolMap);
    return this.sketchService.symbolMap[layer.symbolID];
  }


}
