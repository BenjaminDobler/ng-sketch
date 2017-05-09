import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SketchService} from "../../../services/sketch.service";

@Component({
  selector: '[sketch-image]',
  templateUrl: './sketch-image.component.html',
  styleUrls: ['./sketch-image.component.css']
})
export class SketchImageComponent implements OnInit {

  @Input()
  set data(value: any) {
    this._data = value;
  }

  private _data: any;

  constructor(private sketchService: SketchService) {
  }


  ngOnInit() {
  }


  @HostBinding('attr.x')
  public get x(): number {
    return this._data.$$x;
  }

  @HostBinding('attr.y')
  public get y(): number {
    return this._data.$$y;
  }

  @HostBinding('attr.height')
  public get height(): number {
    return this._data.frame.height;
  }

  @HostBinding('attr.width')
  public get width(): number {
    return this._data.frame.width;
  }

  @HostBinding('attr.rx')
  public get rx(): number {
    return this._data.$$rx;
  }

  @HostBinding('attr.transform')
  public get transform(): number {
    return this._data.$$transform;
  }

  @HostBinding('attr.mask')
  public get mask(): string {
    return 'url(#mask' + this._data.maskId + ')';
  }

  @HostBinding('attr.xlink:href')
  public get imageData(): number {
    return this._data.$$imageData;
  }

}
