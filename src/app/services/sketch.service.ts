import {Injectable, NgZone} from '@angular/core';
import {NSArchiveParser} from './NSArchiveParser';
import {Sketch2Svg} from './sketch2svg';

@Injectable()
export class SketchService {


  private JSZip: any;
  zip: any;

  public images: Array<string> = [];
  pages: Array<any> = [];

  private fs: any;

  page: any;

  rootLayers: Array<any> = [];

  loadedImages: Array<any> = [];

  highlightedLayer: any;
  bplistParser: any;


  constructor(private zone: NgZone) {

  }


  public loadFile() {
    this.page = null;
    this.rootLayers = [];
    this.pages = [];
    const w: any = window;
    const electron = w.nodeRequire('electron');
    this.fs = w.nodeRequire('fs');
    this.JSZip = w.nodeRequire('jszip');
    this.bplistParser = w.nodeRequire('bplist-parser');

    electron.remote.dialog.showOpenDialog({title: 'Select Skecth file'}, (file) => {
      this.readSketchFile(file[0]);
    });

  }


  generateId(level) {

  }


  getPath(data, layer) {
    console.log("Get Path ", data, layer);
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


    let path = '';
    points.forEach((point, index) => {
      if (index == 0) {
        path += `M ${point.point.x},${point.point.y} `;
      }
      path += `C ${point.from.x},${point.from.y} ${point.next.to.x},${point.next.to.y} ${point.next.point.x},${point.next.point.y} `;

    });
    return path;
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
    const hex: string = (r << 16 | g << 8 | b).toString(16).toUpperCase();
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
    let parentLayer:any;
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
    let parentLayer:any;
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

  getFillColor(shapeGroup) {
    if (!shapeGroup.style.fills) {
      return '#000';
    }
    const color: any = shapeGroup.style.fills[0].color;
    return this.colorToHex(color);
  }

  getFill(data) {
    if (!data.gradients) {
      return this.getFillColor(data);
    } else {
      return 'url(#' + data.gradients[0].id + ')';
    }
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
    console.log('NOT FOUND');
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


  private analyzePage(data: any, parent: any, level: string, maskId: string) {

    data.$$id = this.generateUUID();
    this.objects[data.$$id] = data;
    data.masks = [];
    if (parent) {
      data.parent = parent.$$id;
    }

    data.maskId = maskId;
    data.id = level;


    console.log('Data ', data);

    const w: any = window;
    const b: any = w.Buffer;



    if (data._class === 'shapeGroup') {
      console.log("SHAPE GROUP" , data);

      let currentBooleanOperationTarget;
      data.layers.forEach((l,index)=>{
        console.log("Shape Group Layer Boolean "+l.name, l.booleanOperation);
        if (l.booleanOperation!=-1) {
          currentBooleanOperationTarget.booleanOperationObjects.push(l);
        } else {
          currentBooleanOperationTarget = l;
          currentBooleanOperationTarget.booleanOperationObjects = [];
        }
      });

      console.log("Shape Group After " + data.name, data);


    }

    if (data._class === 'text') {
      console.log(data.attributedString.archivedAttributedString._archive);
      const archiveData: string = data.attributedString.archivedAttributedString._archive;

      if (data.style.textStyle) {
        let arch = data.style.textStyle.encodedAttributes.NSParagraphStyle._archive;
        const buf2 = b.from(archiveData, 'base64');
        this.bplistParser.parseFile(buf2,  (err, obj)=> {
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


    }

    if (data.style && data.style.fills && data.style.fills.length > 0) {
      if (data.style.fills[0].gradient) {
        console.log('Has gradient! ');

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

        data.linearGradients = data.gradients.filter(x=>x.gradientType === 0);
        data.radialGradients = data.gradients.filter(x=>x.gradientType === 1);


      }
    }

    console.log('Data ', data);


    for (const i in data) {

      if (i === 'layers') {
        let hasClippingMask = false;
        let mId = '';
        data[i].forEach((layer, index) => {
          this.analyzePage(layer, data, level + '-' + index, mId);
          if (layer.hasClippingMask) {
            hasClippingMask = true;
            mId = level + '-' + index;
            data.masks.push(layer);
          }

        });

      }
    }


  }


  private readSketchFile(path: string) {

    const loadedData = {};

    this.fs.readFile(path, (err, data) => {
      if (err) throw err;
      this.JSZip.loadAsync(data).then((zip) => {
        this.zip = zip;
        let pageNum = 0;
        // zip contains a json file that describes all the directory & files in the zip file
        Object.keys(zip.files).forEach((key: string) => {
          console.log(key);

          if (key.startsWith('pages')) {
            console.log('Pages ', key);
            this.zip.file(key).async('string')
              .then((data) => {
                console.log('Data', data);
                const json = JSON.parse(data);
                this.zone.run(() => {
                  this.analyzePage(json, null, pageNum + '', '');
                  console.log('Analyzed Data ', json);


                  this.pages.push({
                    data: json,
                    file: key
                  });
                });
              });
            pageNum++;
          }

          if (key.endsWith('png')) {
            this.zone.run(() => {
              this.images.push(key);
              this.loadImage(key);

            });

          }

        });

      });

    });


    setTimeout(() => {
      const converter: Sketch2Svg = new Sketch2Svg();
      console.log(converter.convert(this.pages[0].data, this));
    }, 3000);


  }


  loadImage(id) {
    this.zip.file(id).async('base64')
      .then((data64) => {
        this.loadedImages[id] = 'data:image/jpeg;base64,' + data64;
      });

  }


}
