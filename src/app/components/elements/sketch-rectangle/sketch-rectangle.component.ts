import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SketchService} from "../../../services/sketch.service";

@Component({
  selector: '[sketch-rectangle]',
  templateUrl: './sketch-rectangle.component.html',
  styleUrls: ['./sketch-rectangle.component.css']
})
export class SketchRectangleComponent implements OnInit {

  @Input()
  set data(value: any) {
    console.log("Set Rect Data ", value);
    this._data = value;
  }


  rect: any;
  private _data:any;

  constructor(private sketchService:SketchService) {

  }

  ngOnInit() {
  }


  @HostBinding('attr.x')
  public get x():number {
    return this._data.$$x;
  }

  @HostBinding('attr.y')
  public get y():number{
    return this._data.$$y;
  }

  @HostBinding('attr.height')
  public get height():number {
    return this._data.frame.height;
  }

  @HostBinding('attr.width')
  public get width():number {
    return this._data.frame.width;
  }

  @HostBinding('attr.rx')
  public get rx():number {
    return this._data.$$rx;
  }

  @HostBinding('attr.transform')
  public get transform():string {
    return this._data.$$transform;
  }




}
