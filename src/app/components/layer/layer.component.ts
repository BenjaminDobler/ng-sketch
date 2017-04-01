import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {SketchService} from "../../services/sketch.service";

@Component({
  selector: 'layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {


  @Input()
  public index;


  @Input()
  public set data(value: any) {
    console.log("Data ", this.data)
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
    console.log("Points ", data.points)
    let points: Array<any> = [];
    data.points.forEach((x, index) => {
      points.push({
        from: this.toPoint(x.curveFrom, layer.frame.width, layer.frame.height),
        to: this.toPoint(x.curveTo, layer.frame.width, layer.frame.height),
        point: this.toPoint(x.point, layer.frame.width, layer.frame.height),
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
      console.log(point);
      if (index == 0) {
        path += `M ${point.point.x},${point.point.y} `;
      }
      path += `C ${point.from.x},${point.from.y} ${point.next.to.x},${point.next.to.y} ${point.next.point.x},${point.next.point.y} `;

    });
    //path += " Z";
    //'M 200 90 C 200  90 0 0 90  300';
    console.log("Path ", path)
    return path;
  }


//{0, 0}
  toPoint(p: any, width: number = 1, height: number = 1) {
    console.log("To Point ", p);
    p = p.substring(1);
    p = p.substring(0, p.length - 1);
    p = p.split(',');
    return {
      x: Number(p[0].trim()) * width,
      y: Number(p[1].trim()) * height
    };
  }


  getStrokeColor(shapeGroup) {
    function rgb2hex(rgb) {
      rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
      return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    let hex: string = "#fff";
    if (shapeGroup.style.borders) {
      let color: any = shapeGroup.style.borders[0].color;
      hex = rgb2hex('rgba(' + Math.round(color.red * 255) + ',' + Math.round(color.blue * 255) + ',' + Math.round(color.green * 255) + ',' + color.alpha + ')');
    }
    return hex;
    //shapeGroup.style.borders[0].color.


  }

  getFillColor(shapeGroup) {

    function rgb2hex(rgb) {
      rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
      return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }
    if (shapeGroup.style.fills) {
      let color: any = shapeGroup.style.fills[0].color;
      let hex: string = rgb2hex('rgba(' + Math.round(color.red * 255) + ',' + Math.round(color.blue * 255) + ',' + Math.round(color.green * 255) + ',' + color.alpha + ')');
      return hex;

    }
    return "#ffff";


  }

  getStrokeWidth(shapeGroup) {
    console.log("Shape Group ", shapeGroup);
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
