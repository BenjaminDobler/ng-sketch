import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SketchService} from "../../services/sketch.service";

@Component({
  selector: 'sketch-navigation-layer',
  templateUrl: './sketch-navigation-layer.component.html',
  styleUrls: ['./sketch-navigation-layer.component.css']
})
export class SketchNavigationLayerComponent implements OnInit {

  constructor(private sketchService:SketchService) { }


  public open:boolean = false;

  @Input()
  set data(value:any) {
    this._data = value;
    if (!this._data.$$level) {
      this.open = true;
    }
  }

  get data():any  {
    return this._data;
  }

  getPadding():string {
    return (this._data.$$level * 20) + 'px';
  }

  private _data:any;

  highlight(layer) {
    //this.sketchService.highlightedLayer = layer;
    //console.log(this.sketchService.selectedDocument.getLayerSymbol(layer.name));
    this.sketchService.selectedSymbolId = layer.name;
  }



  ngOnInit() {
  }

}
