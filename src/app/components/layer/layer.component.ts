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
    /*
    if (value && value._class === 'symbolInstance') {

      let symbol = this.getSymbol(value);

      let parent = this.sketchService.objects[value.parent];
      symbol._class = 'group';
      console.log("Analyze symbol!");
      symbol.$$id = value.$$id;
      symbol.frame = value.frame;

      this.sketchService.analyzePage(symbol, parent, parent.$$level + 1, "0","0");
      console.log("Symbol ", symbol);

      //symbol.$$x = value.$$x;
      //symbol.$$y = value.$$y;
      console.log("Value ", value);

      this._data = symbol;//this.getSymbol(value);
    } else {
      this._data = value;
    }
    */
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
