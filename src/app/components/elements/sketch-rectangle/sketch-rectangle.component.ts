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
    this.rect.width = value.frame.width;
    this.rect.height = value.frame.height;
    console.log(value)
    let p:any = this.sketchService.toPoint(value.path.points[0].point, value);
    this.rect.x = p.x;
    this.rect.y = p.y;
    this.rect.rx = 0;
    this.rect.transform = this.sketchService.getTransformation(value);
    if (value.fixedRadius) {
      this.rect.rx = value.fixedRadius;
    }
    this._data = value;
  }


  rect: any;
  private _data:any;

  constructor(private sketchService:SketchService) {
    console.log("Init Rectangle!");
    this.rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill:'none'
    };
  }

  ngOnInit() {
  }


  @HostBinding('attr.x')
  public get x():number {
    return this.rect.x;
  }

  @HostBinding('attr.y')
  public get y():number{
    return this.rect.y;
  }

  @HostBinding('attr.height')
  public get height():number {
    return this.rect.height;
  }

  @HostBinding('attr.width')
  public get width():number {
    return this.rect.width;
  }

  @HostBinding('attr.rx')
  public get rx():number {
    return this.rect.rx;
  }

  @HostBinding('attr.transform')
  public get transform():number {
    return this.rect.transform;
  }




}
