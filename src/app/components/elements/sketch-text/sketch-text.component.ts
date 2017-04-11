import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SketchService} from "../../../services/sketch.service";

@Component({
  selector: '[sketch-text]',
  templateUrl: './sketch-text.component.html',
  styleUrls: ['./sketch-text.component.css']
})
export class SketchTextComponent implements OnInit {

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
    this.properties.fontSize = this.sketchService.getFontSize(this._data);
    this.properties.fontFamily = this.sketchService.getFontFamily(this._data);
    this.properties.text = this._data.decodedTextAttributes.NSString;
    let p:any = this.sketchService.getLayerCoords(this._data);
    this.properties.x = p.x;
    this.properties.y = p.y + this._data.frame.height;
    this.properties.width = this._data.frame.width;
    this.properties.height = this._data.frame.height;
    this.properties.transform = this.sketchService.getTransformation(this._data);
    this.properties.mask = 'url(#mask'+this._data.maskId+')';
  }

  ngOnInit() {
  }


  @HostBinding('attr.fill')
  public get fill(): string {
    return this.properties.fill;
  }

  @HostBinding('attr.font-size')
  public get fontSize(): string {
    return this.properties.fontSize;
  }

  @HostBinding('attr.font-family')
  public get fontFamily(): string {
    return this.properties.fontFamily;
  }

  @HostBinding('attr.x')
  public get x():number {
    return this.properties.x;
  }

  @HostBinding('attr.y')
  public get y():number{
    return this.properties.y;
  }

  @HostBinding('attr.height')
  public get height():number {
    return this.properties.height;
  }

  @HostBinding('attr.width')
  public get width():number {
    return this.properties.width;
  }

  @HostBinding('attr.rx')
  public get rx():number {
    return this.properties.rx;
  }

  @HostBinding('attr.transform')
  public get transform():number {
    return this.properties.transform;
  }

  @HostBinding('attr.mask')
  public get mask():number {
    return this.properties.mask;
  }

}
