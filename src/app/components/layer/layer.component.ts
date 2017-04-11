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



  isRect(data) {


    let rectPoints = data.points.map(x=>this.sketchService.toPoint(x.point)).filter((p)=>{
      if ((p.x === 0 || p.x === 1) && (p.y === 0 || p.y === 1)) {
        return true;
      }
      return false;
    });

    console.log("Is Rect ", data.points, rectPoints.length === data.points.length);

    return rectPoints.length === data.points.length;
  }


  getPath(data, layer) {

    const points: Array<any> = [];
    data.points.forEach((x) => {
      points.push({
        from: this.sketchService.toPoint(x.curveFrom, layer),
        to: this.sketchService.toPoint(x.curveTo, layer),
        point: this.sketchService.toPoint(x.point, layer),
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
      if (data.isClosed || index < points.length-1) {
        path += `C ${point.from.x},${point.from.y} ${point.next.to.x},${point.next.to.y} ${point.next.point.x},${point.next.point.y} `;
      }

    });
    return path;
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
    if (hex == '0') {
      return '#000';
    }
    return '#' + hex;
  }

  getTransformation(data) {
    let coords = this.sketchService.getLayerCoords(data);
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
      return 'none';
    }

    if (!shapeGroup.style.fills[0].isEnabled) {
      return 'none';
    }
    const color: any = shapeGroup.style.fills[0].color;
    return this.colorToHex(color);
  }

  getStrokeWidth(shapeGroup) {
    if (shapeGroup.style.borders) {
      return shapeGroup.style.borders[0].thickness;
    }
    return 0;
  }

  getImageData(layer) {
    if (this.sketchService.loadedImages[layer.image._ref + '.png']) {
      return this.sketchService.loadedImages[layer.image._ref + '.png'];
    }

    return '';
  }



}
