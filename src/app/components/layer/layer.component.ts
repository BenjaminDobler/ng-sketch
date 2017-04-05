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


  getPath(data, layer) {
    const points: Array<any> = [];
    data.points.forEach((x, index) => {
      points.push({
        from: this.toPoint(x.curveFrom, layer),
        to: this.toPoint(x.curveTo, layer),
        point: this.toPoint(x.point, layer),
      });
    });

    points.forEach((p, index) => {
      let next;
      if (index + 1 >= points.length) {
        next = points[0];
      } else {
        next = points[index + 1];
      }
      p.next = next;

    });


    let path: string = '';
    points.forEach((point, index) => {
      if (index == 0) {
        path += `M ${point.point.x},${point.point.y} `;
      }
      path += `C ${point.from.x},${point.from.y} ${point.next.to.x},${point.next.to.y} ${point.next.point.x},${point.next.point.y} `;

    });
    return path;
  }


  //{0, 0}
  toPoint(p: any, layer) {
    let coords = this.getLayerCoords(layer);
    p = p.substring(1);
    p = p.substring(0, p.length - 1);
    p = p.split(',');


    return {
      x: coords.x + Number(p[0].trim()) * layer.frame.width,
      y: coords.y + Number(p[1].trim()) * layer.frame.height
    };
  }


  getLayerCoords(layer) {
    let x = 0;
    let y = 0;
    while (layer.parent) {
      x += layer.frame.x;
      y += layer.frame.y;
      layer = layer.parent;
    }
    return {
      x: x,
      y: y
    };
  }


  getStrokeColor(shapeGroup) {
    if (!shapeGroup.style.borders) {
      return '#000';
    }
    const color:any = shapeGroup.style.borders[0].color;
    return this.colorToHex(color);
  }


  colorToHex(color: any) {
    const r: number = Math.round(color.red * 255);
    const g: number = Math.round(color.green * 255);
    const b: number = Math.round(color.blue * 255);
    const hex: string = (r << 16 | g << 8 | b).toString(16).toUpperCase();
    return '#' + hex;
  }

  getTransformation(data) {
    let coords = this.getLayerCoords(data);
    let w = data.frame.width;
    let h = data.frame.height;
    let x = coords.x+(w/2);
    let y = coords.y+(h/2);
    return 'rotate('+(-1*data.rotation)+' '+x+' '+y+')';
  }


  getFill(data) {
    if (!data.gradients) {
      return this.getFillColor(data);
    } else {
      return 'url(#'+data.gradients[0].id+')';
    }
  }

  getFillColor(shapeGroup) {
    if (!shapeGroup.style.fills) {
      return '#000';
    }
    const color: any = shapeGroup.style.fills[0].color;
    return this.colorToHex(color);
  }

  getStrokeWidth(shapeGroup) {
    if (shapeGroup.style.borders) {
      return shapeGroup.style.borders[0].thickness;
    }
    return 0;
    //return 3;
  }

  getImageData(layer) {
    if (this.sketchService.loadedImages[layer.image._ref + '.png']) {
      return this.sketchService.loadedImages[layer.image._ref + '.png'];
    }

    return '';
  }

}
