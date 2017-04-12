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
    this.parseProperties();
  }

  private properties: any = {};
  private _data: any;

  constructor(private sketchService: SketchService) {
  }

  private parseProperties() {
    console.log("Parse Properties ", this._data)
    this.properties.fill = '#000';
    let p: any = this.sketchService.getLayerCoords(this._data);
    this.properties.x = p.x;
    this.properties.y = p.y;
    this.properties.width = this._data.frame.width;
    this.properties.height = this._data.frame.height;
    this.properties.transform = this._data.$$transform;//this.sketchService.getTransformation(this._data);
    this.properties.mask = 'url(#mask' + this._data.maskId + ')';
    this.properties.imageData = this.sketchService.getImageData(this._data)
  }

  ngOnInit() {
  }


  @HostBinding('attr.x')
  public get x(): number {
    return this.properties.x;
  }

  @HostBinding('attr.y')
  public get y(): number {
    return this.properties.y;
  }

  @HostBinding('attr.height')
  public get height(): number {
    return this.properties.height;
  }

  @HostBinding('attr.width')
  public get width(): number {
    return this.properties.width;
  }

  @HostBinding('attr.rx')
  public get rx(): number {
    return this.properties.rx;
  }

  @HostBinding('attr.transform')
  public get transform(): number {
    return this.properties.transform;
  }

  @HostBinding('attr.mask')
  public get mask(): number {
    return this.properties.mask;
  }

  @HostBinding('attr.xlink:href')
  public get imageData(): number {
    return this.properties.imageData;
  }

}


/**
 <svg:image *ngIf="data?._class==='bitmap'"
 [attr.mask]="'url(#mask'+data.maskId+')'"
 [attr.x]="data.frame.x"
 [attr.y]="data.frame.y"
 [attr.xlink:href]="getImageData(data)"
 [attr.height]="data.frame.width"
 [attr.width]="data.frame.height"/>
 **/
