import {Injectable, NgZone} from '@angular/core';
import {NSArchiveParser} from './NSArchiveParser';
import {Sketch2Svg} from './sketch2svg';
import {SketchLoader} from "./sketch.loader";

@Injectable()
export class SketchService {


  public images: Array<string> = [];
  pages: Array<any> = [];

  page: any;

  rootLayers: Array<any> = [];

  loadedImages: Array<any> = [];

  highlightedLayer: any;
  bplistParser: any;

  sketchLoader: SketchLoader;

  layerNameMap = {};


  constructor(private zone: NgZone) {

  }


  public loadFile() {

    const w: any = window;
    this.bplistParser = w.nodeRequire('bplist-parser');

    this.sketchLoader = new SketchLoader();
    this.sketchLoader.openDialog()
      .then((data: any) => {
        data.pages.forEach((page, pageNum) => {
          page.data.$$level = 0;
          this.analyzePage(page.data, 1, null, pageNum + '', '');
        });
        this.pages = data.pages;
        this.loadedImages = data.imageMap;
        this.zone.run(() => {
          this.selectPage(this.pages[0]);
        });


        //let svg:Sketch2Svg = new Sketch2Svg();
        //console.log(svg.convert(this.pages[0].data, this, 'myOval'));
      });
  }

  public selectPage(page) {
    this.page = page;
    this.rootLayers = [page.data];
  }


  getPath(layer) {
    const points: Array<any> = [];
    layer.path.points.forEach((x) => {
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
      if (layer.path.isClosed || index < points.length - 1) {
        path += `C ${point.from.x},${point.from.y} ${point.next.to.x},${point.next.to.y} ${point.next.point.x},${point.next.point.y} `;
      }

    });


    if (layer.booleanOperationObjects && layer.booleanOperationObjects.length > 0) {
      let w: any = window;

      var canvas = document.getElementById('myCanvas');
      // Create an empty project and a view for the canvas:
      w.paper.setup(canvas);
      let paper: any = w.paper;
      let paperPath = new paper.Path(path);


      let operations = layer.booleanOperationObjects.map(x => x.booleanOperation);
      operations = [layer.booleanOperation, ...operations];
      console.log("GET PATH Layer ", operations);


      layer.booleanOperationObjects.forEach((b) => {
        let shape: any;

        if (b.$$isRect) {
          let rect: any = {};
          let p: any = this.toPoint(b.path.points[0].point, b);
          rect.x = p.x;
          rect.y = p.y;
          rect.width = b.frame.width;
          rect.height = b.frame.height;
          shape = paper.Path.Rectangle(rect.x, rect.y, rect.width, rect.height);
        } else {
          shape = new paper.Path(this.getPath(b));
        }


        if (b.booleanOperation === 2) {
          paperPath = paperPath.intersect(shape);
        } else if (b.booleanOperation === 3) {
          paperPath = paperPath.exclude(shape);
        } else {
          paperPath = paperPath.subtract(shape);
        }
      });
      return paperPath.pathData;
    }

    return path;
  }

  isRect(data): boolean {
    const rectPoints = data.points.map(x => this.toPoint(x.point)).filter((p) => {
      if ((p.x === 0 || p.x === 1) && (p.y === 0 || p.y === 1)) {
        return true;
      }
      return false;
    });
    return rectPoints.length === data.points.length;
  }


  isCircle(data): boolean {
    const isCurved:boolean = data.points.filter(x=>(x.hasCurveTo&&x.hasCurveFrom)).length === 0;
    const rectPoints = data.points.map(x => this.toPoint(x.point)).filter((p) => {
      if (isCurved && (p.x === 0 || p.x === 1 || p.x === 0.5) && (p.y === 0 || p.y === 1 || p.y === 0.5)) {
        return true;
      }
      return false;
    });
    return (rectPoints.length === data.points.length) && isCurved;
  }


  isLine(data): boolean {
    if (data.points.length === 2 && !data.points[0].hasCurveFrom && !data.points[0].hasCurveTo && !data.points[1].hasCurveFrom && !data.points[1].hasCurveTo) {
      return true;
    }
    return false;
  }


  getTransformation(data) {
    const coords = this.getLayerCoords(data);
    const w = data.frame.width;
    const h = data.frame.height;
    const x = coords.x + (w / 2);
    const y = coords.y + (h / 2);
    return 'rotate(' + (-1 * this.getLayerRotation(data).rotation) + ' ' + x + ' ' + y + ')';
  }


  colorToHex(color: any) {
    const r: number = Math.round(color.red * 255);
    const g: number = Math.round(color.green * 255);
    const b: number = Math.round(color.blue * 255);
    let hex: string = (r << 16 | g << 8 | b).toString(16).toUpperCase();
    if (hex === "0") {
      hex = "000000";
    }
    return '#' + hex;
  }

  toPoint(p: any, layer?) {
    let coords = {x: 0, y: 0};
    let refWidth = 1;
    let refHeight = 1;
    if (layer) {
      coords = this.getLayerCoords(layer);
      refWidth = layer.frame.width;
      refHeight = layer.frame.height;
    }
    p = p.substring(1);
    p = p.substring(0, p.length - 1);
    p = p.split(',');


    return {
      x: coords.x + Number(p[0].trim()) * refWidth,
      y: coords.y + Number(p[1].trim()) * refHeight
    };
  }

  getLayerCoords(layer) {
    let x = 0;
    let y = 0;
    let parentLayer: any;
    while (layer.parent) {
      parentLayer = this.objects[layer.parent];
      x += layer.frame.x;
      y += layer.frame.y;
      layer = parentLayer;
    }
    return {
      x: x,
      y: y
    };
  }


  getLayerRotation(layer) {
    let rotation = 0;
    let parentLayer: any;
    while (layer.parent) {
      parentLayer = this.objects[layer.parent];
      rotation += layer.rotation;
      layer = parentLayer;
    }
    return {
      rotation: rotation,
    };
  }


  getStrokeColor(shapeGroup) {
    if (!shapeGroup.style.borders) {
      return '#000';
    }
    const color: any = shapeGroup.style.borders[0].color;
    return this.colorToHex(color);
  }

  getStrokeWidth(shapeGroup) {
    if (shapeGroup.style.borders) {
      return shapeGroup.style.borders[0].thickness;
    }
    return 0;
    //return 3;
  }

  getFill(data) {
    if (!data.gradients) {
      return this.getFillColor(data);
    } else {
      return 'url(#' + data.gradients[0].id + ')';
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

  getFontSize(data) {
    if (data.decodedTextAttributes.NSAttributes.MSAttributedStringFontAttribute) {
      return data.decodedTextAttributes.NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute;

    }
    return 10;
  }

  getFontFamily(data) {
    if (data.decodedTextAttributes.NSAttributes.MSAttributedStringFontAttribute) {
      return data.decodedTextAttributes.NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute
    }
    return 'Helvetica';
  }

  getImageData(layer) {
    if (this.loadedImages[layer.image._ref + '.png']) {
      return this.loadedImages[layer.image._ref + '.png'];
    }
    return '';
  }


  objects: any = {};


  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }


  private analyzePage(data: any, parent: any, level:number, id: string, maskId: string) {
    data.$$id = this.generateUUID();
    data.$$transform = this.getTransformation(data);
    this.objects[data.$$id] = data;
    this.layerNameMap[data.name] = data;
    data.masks = [];
    data.$$level = level;
    if (parent) {
      data.parent = parent.$$id;
    }

    data.maskId = maskId;
    data.id = id;

    const w: any = window;
    const b: any = w.Buffer;


    if (data._class === 'text') {
      const archiveData: string = data.attributedString.archivedAttributedString._archive;

      if (data.style.textStyle) {
        let arch = data.style.textStyle.encodedAttributes.NSParagraphStyle._archive;
        const buf2 = b.from(archiveData, 'base64');
        this.bplistParser.parseFile(buf2, (err, obj) => {
          if (err) throw err;
          const parser: NSArchiveParser = new NSArchiveParser();
          data.___MSAttributedStringFontAttribute = parser.parse(obj);
        });

      }


      const buf = b.from(archiveData, 'base64');


      this.bplistParser.parseFile(buf, function (err, obj) {
        if (err) throw err;
        const parser: NSArchiveParser = new NSArchiveParser();
        data.decodedTextAttributes = parser.parse(obj);
      });


      data.$$fontSize = this.getFontSize(data);
      data.$$fontFamily = this.getFontFamily(data);
      data.$$text = data.decodedTextAttributes.NSString;


    }

    if (data.style && data.style.fills && data.style.fills.length > 0) {
      if (data.style.fills[0].gradient) {
        const gradient = data.style.fills[0].gradient;
        const linearGradient: any = {};
        linearGradient.gradientType = gradient.gradientType;
        const from = this.toPoint(gradient.from);
        const to = this.toPoint(gradient.to);
        linearGradient.x1 = from.x * 100 + '%';
        linearGradient.x2 = to.x * 100 + '%';
        linearGradient.y1 = from.y * 100 + '%';
        linearGradient.y2 = to.y * 100 + '%';
        linearGradient.stops = [];
        linearGradient.id = 'gradient-' + data.id;

        gradient.stops.forEach((stop) => {
          const hex: string = this.colorToHex(stop.color);
          linearGradient.stops.push({
            color: hex,
            offset: stop.position * 100 + '%',
            opacity: stop.color.alpha
          });

        });

        data.gradients = [linearGradient];

        data.linearGradients = data.gradients.filter(x => x.gradientType === 0);
        data.radialGradients = data.gradients.filter(x => x.gradientType === 1);


      }
    }

    if (data._class === 'shapeGroup') {
      let currentBooleanOperationTarget;
      data.layers.forEach((l, index) => {
        l.parent = data.$$id;

        if (l.booleanOperation != -1 && currentBooleanOperationTarget) {
          currentBooleanOperationTarget.booleanOperationObjects.push(l);
        } else {
          l.isBooleanOperationTarget = true;
          currentBooleanOperationTarget = l;
          currentBooleanOperationTarget.booleanOperationObjects = [];
        }

        l.$$isRect = this.isRect(l.path);
        l.$$isLine = this.isLine(l.path);
        l.$$isCircle = this.isCircle(l.path);
        console.log("Is Circle ", this.isCircle(l.path));

      });


      data.layers.forEach((l, index) => {
        if (l.isBooleanOperationTarget && l.booleanOperationObjects.length === 0) {
          l.isBooleanOperationTarget = false;
        }

      });

      data.layers.forEach((l) => {
        l.$$path = this.getPath(l);

        if (l.$$isRect) {
          l.$$rx = 0;
          if (l.fixedRadius) {
            l.$$rx = l.fixedRadius;
          }
        }

        if (l.$$isLine) {
          let p1: any = this.toPoint(l.path.points[0].point, l);
          let p2: any = this.toPoint(l.path.points[1].point, l);
          l.$$x1 = p1.x;
          l.$$y1 = p1.y;
          l.$$x2 = p2.x;
          l.$$y2 = p2.y;
        }

        if (l.$$isCircle) {
          let p1: any = this.toPoint(l.path.points[0].point, l);
          let p2: any = this.toPoint(l.path.points[1].point, l);
          let p3: any = this.toPoint(l.path.points[1].point, l);
          l.$$cx = p2.x - p1.x;
          l.$$cy = p2.y - p1.y;

          l.$$radius = 100;

        }

        let p: any = this.toPoint(l.path.points[0].point, l);
        l.$$x = p.x;
        l.$$y = p.y;
        l.$$transform = this.getTransformation(l);


        if (l.$$isRect && l.booleanOperation <= 0) {
          l.$$drawAsRect = true;
        }

        if (l.$$isCircle && l.booleanOperation <= 0) {
          l.$$drawAsCircle = true;
        }

        if (l.$$isLine && l.booleanOperation <= 0) {
          l.$$drawAsLine = true;
        }

        if (!l.$$isRect && !l.$$isLine && !l.$$isCircle && l.booleanOperation <= 0) {
          l.$$drawAsPath = true;
        }

        if (l.isBooleanOperationTarget) {
          l.$$drawAsPath = true;
          l.$$drawAsRect = false;
          l.$$drawAsLine = false;
        }


      });

      data.$$strokeColor = this.getStrokeColor(data);
      data.$$fill = this.getFill(data);
      data.$$strokeWidth = this.getStrokeWidth(data);

    }


    for (const i in data) {

      if (i === 'layers') {
        let hasClippingMask = false;
        let mId = '';
        let newLevel:number = level +1;
        data[i].forEach((layer, index) => {
          this.analyzePage(layer, data, newLevel, id + '-' + index, mId);
          if (layer.hasClippingMask) {
            hasClippingMask = true;
            mId = id + '-' + index;
            data.masks.push(layer);
          }

        });

      }
    }


  }


}
