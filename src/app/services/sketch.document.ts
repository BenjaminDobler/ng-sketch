/**
 * Created by benjamindobler on 07.05.17.
 */


import {NSArchiveParser} from './NSArchiveParser';

//import Handlebars;


export class SketchDocument {


  public images: Array<string> = [];
  pages: Array<any> = [];

  page: any;

  rootLayers: Array<any> = [];

  loadedImages: Array<any> = [];

  highlightedLayer: any;
  bplistParser: any;

  layerNameMap = {};
  public filePath: string;
  public fileName: string;

  public svg: string;
  private Handlebars: any;
  private svgTemplate: any;

  constructor(sourceData?: any) {
    const w: any = window;
    this.bplistParser = w.nodeRequire('bplist-parser');
    this.Handlebars = w.Handlebars;


    if (sourceData) {

     this.setData(sourceData);

    } else {
      this.loadTemplate();
    }


  }


  setData(data:any) {
    this.pageSVGMap = {};
    this.loadTemplate(() => {
      console.log("========= Set Data")
      this.filePath = data.filePath;
      this.fileName = data.fileName;
      this.pages = data.pages;
      this.loadedImages = data.imageMap;
      this.initPages();
    });
  }


  loadTemplate(cb?: any) {
    fetch('assets/templates/handlebars.tpl').then((data) => {
      return data.text();
    }).then((data: string) => {
      this.Handlebars.registerPartial('layer', data);
      this.svgTemplate = this.Handlebars.compile(data);
      if (cb) {
        cb();
      }
    });
  }


  initPages() {
    this.pages.forEach((page, pageNum) => {
      //page.data.$$level = 0;
      this.findSymbolMasters(page.data);
    });

    this.pages.forEach((page, pageNum) => {
      //page.data.$$level = 0;
      this.fillSymbolInstances(page.data);
    });

    this.pages.forEach((page, pageNum) => {
      page.data.$$level = 0;
      this.analyzeInitialLayer(page.data, null, pageNum + '', '', '');
    });


    this.selectPage(this.pages[0].data.name);


    //this.loadedImages = data.imageMap;
  }

  selectPage(pageName) {
    console.log("Select Map!");
    if (this.pageSVGMap[pageName]) {
      this.svg = this.pageSVGMap[pageName];
    } else {
      const page = this.pages.filter(x => x.data.name === pageName).pop();
      let svg: string = this.render(page.data);
      this.pageSVGMap[pageName] = svg;
      this.svg = svg;
    }

  }

  private idCount: number = 0;


  public analyzeInitialLayer(data: any, parent: any, id: any, maskId: any, rootSymbolId: string = '') {
    data.$$id = id;//this.generateUUID();
    data.$$transform = this.getTransformation(data, rootSymbolId);
    this.objects[data.$$id] = data;
    this.layerNameMap[data.name] = data;
    data.masks = [];

    if (parent && parent.$$level) {
      data.$$level = parent.$$level + 1;
    } else {
      data.$$level = 1;
    }

    data.$$shapeGroup = data._class === 'shapeGroup';
    data.$$bitmap = data._class === 'bitmap';
    data.$$text = data._class === 'text';
    this.symbolMap[data.name] = data;




    if (parent) {
      data.parent = parent.$$id;
    }

    data.$$maskId = maskId;

    const w: any = window;
    const b: any = w.Buffer;

    if (data._class === 'text') {
      const archiveData: string = data.attributedString.archivedAttributedString._archive;

      if (data.style.textStyle) {
        const arch = data.style.textStyle.encodedAttributes.NSParagraphStyle._archive;
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

      if (data.decodedTextAttributes.NSAttributes && data.decodedTextAttributes.NSAttributes.NSColor) {
        const colorArray = data.decodedTextAttributes.NSAttributes.NSColor.NSRGB.toString().split(' ');
        const colors: any = {};
        colors.red = parseFloat(colorArray[0]);
        colors.green = parseFloat(colorArray[1]);
        colors.blue = parseFloat(colorArray[2]);
        if (colorArray.length > 3) {
          data.$$fillOpacity = parseFloat(colorArray[3]);
        }
        data.$$fontColor = this.colorToHex(colors);
      } else {
        data.$$fontColor = '#000000';
        data.$$fillOpacity = 1;

      }

      if (data.decodedTextAttributes.NSAttributes.NSParagraphStyle) {
        const paragraphSpacing = data.decodedTextAttributes.NSAttributes.NSParagraphStyle.NSParagraphSpacing;
        const maxLineHeight = data.decodedTextAttributes.NSAttributes.NSParagraphStyle.NSMaxLineHeight;
        const minLineHeight = data.decodedTextAttributes.NSAttributes.NSParagraphStyle.NSMinLineHeight;
        const lineHeight = minLineHeight;
        data.$$paragraphSpacing = paragraphSpacing;
        data.$$minLineHeight = minLineHeight;
        data.$$maxLineHeight = maxLineHeight;
        data.$$lineHeight = lineHeight;
      }


      data.$$fontSize = this.getFontSize(data);
      data.$$fontFamily = this.getFontFamily(data);
      data.$$text = data.decodedTextAttributes.NSString;
      const p: any = this.getLayerCoords(data, rootSymbolId);
      data.$$x = p.x;
      data.$$y = p.y + data.$$fontSize; // is this the baseline? SVG text is positioned at baseline not top/left...
      data.$$transform = this.getTransformation(data, rootSymbolId);


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
        linearGradient.id = 'gradient-' + data.$$id;

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


    if (data.style && data.style.shadows && data.style.shadows.length > 0) {
      data.$$hasFilter = true;
    }



    if (data._class === 'bitmap') {
      data.$$imageData = this.getImageData(data);
      const p: any = this.getLayerCoords(data, rootSymbolId);
      data.$$x = p.x;
      data.$$y = p.y;
      data.$$transform = this.getTransformation(data, rootSymbolId);
    }

    if (data.style && data.style.contextSettings && data.style.contextSettings.opacity) {
      data.$$opacity = data.style.contextSettings.opacity;
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

        l.$$isRect = this.isRect(l.path, data);
        l.$$isLine = this.isLine(l.path);
        l.$$isCircle = this.isCircle(l.path, data);

        console.log("IS CIRCLE ? ", l.$$isCircle);

      });


      data.layers.forEach((l, index) => {
        if (l.isBooleanOperationTarget && l.booleanOperationObjects.length === 0) {
          l.isBooleanOperationTarget = false;
        }

      });

      data.layers.forEach((l) => {
        l.$$path = this.getPath(l, rootSymbolId);

        if (l.$$isRect) {
          l.$$rx = 0;
          if (l.fixedRadius) {
            l.$$rx = l.fixedRadius;
          }
        }

        if (l.$$isLine) {
          const p1: any = this.toPoint(l.path.points[0].point, l, rootSymbolId);
          const p2: any = this.toPoint(l.path.points[1].point, l, rootSymbolId);
          l.$$x1 = p1.x;
          l.$$y1 = p1.y;
          l.$$x2 = p2.x;
          l.$$y2 = p2.y;
        }

        if (l.$$isCircle) {
          const p1: any = this.toPoint(l.path.points[0].point, l, rootSymbolId);
          const p2: any = this.toPoint(l.path.points[1].point, l, rootSymbolId);
          const p3: any = this.toPoint(l.path.points[2].point, l, rootSymbolId);
          const p4: any = this.toPoint(l.path.points[3].point, l, rootSymbolId);


          l.$$cx = p4.x + ((p2.x - p4.x) / 2);
          l.$$cy = p3.y + ((p1.y - p3.y) / 2);

          l.$$radius = (p1.y - p3.y) / 2;

        }

        const p: any = this.toPoint(l.path.points[0].point, l, rootSymbolId);
        l.$$x = p.x;
        l.$$y = p.y;
        l.$$transform = this.getTransformation(l, rootSymbolId);


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



    if (data.layers) {




      let hasClippingMask = false;
      let mId: any;
      data.layers.forEach((layer) => {
        let newId = this.generateUUID();
        this.analyzeInitialLayer(layer, data, newId, mId, rootSymbolId);
        if (layer.hasClippingMask) {
          hasClippingMask = true;
          mId = newId;
          data.masks.push(layer);
        }

      });
    }


    const hasMasks: boolean = data.masks.length > 0;
    const hasLinearGradients: boolean = data.linearGradients && data.linearGradients.length > 0;
    const hasRadialGradients: boolean = data.radialGradients && data.radialGradients.length > 0;
    const hasDrawingLayers: boolean = data.layers && data.layers.filter((l) => {
        return l.$$drawAsCircle || l.$$drawAsRect || l.$$drawAsLine || l.$$drawAsPath;
      }).length > 0;

    data.hasDefs = hasMasks || hasLinearGradients || hasRadialGradients || hasDrawingLayers;

    return data.$$id;


  }


  symbolMasters: any = {};


  findSymbolMasters(page) {
    if (page._class === 'symbolMaster') {
      this.symbolMasters[page.symbolID] = page;
    }

    if (page.layers) {
      page.layers.forEach((p) => {
        this.findSymbolMasters(p);
      });
    }

  }

  fillSymbolInstances(page) {
    if (page._class === 'symbolInstance') {
      let symbol = this.symbolMasters[page.symbolID];
      page.layers = JSON.parse(JSON.stringify(symbol.layers));
      page.layers.forEach((l) => {
        let wPerc = (page.frame.width / symbol.frame.width);
        let hPerc = (page.frame.height / symbol.frame.height);
        this.updateFrame(l, wPerc, hPerc);
      });

      page._class = 'group';
    }

    if (page.layers) {
      page.layers.forEach((p) => {
        this.fillSymbolInstances(p);
      });
    }

  }


  updateFrame(layer, wPerc, hPerc) {
    layer.frame.width = layer.frame.width * wPerc;
    layer.frame.height = layer.frame.height * hPerc;
    if (layer.layers) {
      layer.layers.forEach((l) => {
        this.updateFrame(l, wPerc, hPerc);
      });
    }
  }

  /*
   public selectPage(page) {
   this.page = page;
   this.rootLayers = [page.data];
   }
   */

  getPath(layer, symbolId) {
    const points: Array<any> = [];
    layer.path.points.forEach((x) => {
      points.push({
        from: this.toPoint(x.curveFrom, layer, symbolId),
        to: this.toPoint(x.curveTo, layer, symbolId),
        point: this.toPoint(x.point, layer, symbolId),
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
      if (layer.path.isClosed || index < points.length - 1) {
        path += `C ${point.from.x},${point.from.y} ${point.next.to.x},${point.next.to.y} ${point.next.point.x},${point.next.point.y} `;
      }

    });


    if (layer.booleanOperationObjects && layer.booleanOperationObjects.length > 0) {
      const w: any = window;

      const canvas = document.getElementById('myCanvas');
      // Create an empty project and a view for the canvas:
      w.paper.setup(canvas);
      const paper: any = w.paper;
      let paperPath = new paper.Path(path);


      let operations = layer.booleanOperationObjects.map(x => x.booleanOperation);
      operations = [layer.booleanOperation, ...operations];


      layer.booleanOperationObjects.forEach((b) => {
        let shape: any;

        if (b.$$isRect) {
          const rect: any = {};
          const p: any = this.toPoint(b.path.points[0].point, b);
          rect.x = p.x;
          rect.y = p.y;
          rect.width = b.frame.width;
          rect.height = b.frame.height;
          shape = paper.Path.Rectangle(rect.x, rect.y, rect.width, rect.height);
        } else {
          shape = new paper.Path(this.getPath(b, symbolId));
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

  isRect(data, frame): boolean {
    if (data.points.length !== 4) {
      return false;
    }
    const rectPoints = data.points.map(x => this.toPoint(x.point, frame));
    if (rectPoints.length === 4) {
      const isRect: boolean = this.IsRectangleAnyOrder(rectPoints[0], rectPoints[1], rectPoints[2], rectPoints[3]);
      const hasCurveTo: boolean = data.points.filter(x => x.hasCurveTo === true).length > 0;
      return isRect && !hasCurveTo;
    }
    return false;
  }

  isSqu(data, frame) {
    if (data.points.length !== 4) {
      return false;
    }
    const rectPoints = data.points.map(x => this.toPoint(x.point, frame));
    const isSquare = this.isSquare(rectPoints[0], rectPoints[1], rectPoints[2], rectPoints[3]);
    return isSquare;
  }


  isCircle(data, frame): boolean {
    if (data.points.length !== 4) {
      return false;
    }
    const isSquare: boolean = this.isSqu(data, frame);
    const hasCurveTo: boolean = data.points.filter(x => x.hasCurveTo === true).length === 4;
    if (isSquare && hasCurveTo) {
      return true;
    }
    return false;
  }


  isLine(data): boolean {
    if (data.points.length === 2 && !data.points[0].hasCurveFrom && !data.points[0].hasCurveTo && !data.points[1].hasCurveFrom && !data.points[1].hasCurveTo) {
      return true;
    }
    return false;
  }


  getTransformation(data, rootSymbolId: string) {
    const coords = this.getLayerCoords(data, rootSymbolId);
    const w = data.frame.width;
    const h = data.frame.height;
    const x = coords.x + (w / 2);
    const y = coords.y + (h / 2);
    return 'rotate(' + (-1 * this.getLayerRotation(data).rotation) + ' ' + x + ' ' + y + ')';
  }


  colorToHex(color: any) {

    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };


    const rgbToHex = (r, g, b) => {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };


    const r: number = Math.round(color.red * 255);
    const g: number = Math.round(color.green * 255);
    const b: number = Math.round(color.blue * 255);
    return rgbToHex(r, g, b);

  }

  toPoint(p: any, layer?, rootSymbolId?: string) {
    let coords = {x: 0, y: 0};
    let refWidth = 1;
    let refHeight = 1;
    if (layer) {
      coords = this.getLayerCoords(layer, rootSymbolId);
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


  getLayerCoords(layer, rootLayerId: string) {
    let x = 0;
    let y = 0;
    let parentLayer: any;
    while (layer.parent && layer.name != rootLayerId) {

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
    if (!shapeGroup.style.borders[0].isEnabled) {
      return '';
    }
    return this.colorToHex(color);
  }

  getStrokeWidth(shapeGroup) {
    if (shapeGroup.style.borders && shapeGroup.style.borders[0].isEnabled) {
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
      return data.decodedTextAttributes.NSAttributes.MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute;
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
  symbolMap: any = {};


  generateUUID() { // Public Domain/MIT
    this.idCount++;
    return this.idCount;
  }


  getSymbolDoc(id: string) {
    const symbol = new SketchSymbol(this, id);
  }


  pageSVGMap: any = {};


  render(context) {
    let svg = this.svgTemplate(context);
    this.svg = svg;
    return svg;
  }


  svgSymbolMap: any = {};


  getLayerSymbol(symbolId: string) {
    if (this.svgSymbolMap[symbolId]) {
      return this.svgSymbolMap[symbolId];
    }
    let clone: any = JSON.parse(JSON.stringify(this.symbolMap[symbolId]));
    this.analyzeInitialLayer(clone, null, 'synmbol' + '', '', symbolId);
    const svg = this.svgTemplate(clone);
    this.svgSymbolMap[symbolId] = svg;
    return svg;
  }


  IsOrthogonal(a, b, c) {
    return (b.x - a.x) * (b.x - c.x) + (b.y - a.y) * (b.y - c.y) === 0;
  }

  IsRectangle(a, b, c, d) {
    return this.IsOrthogonal(a, b, c) && this.IsOrthogonal(b, c, d) && this.IsOrthogonal(c, d, a);
  }

  IsRectangleAnyOrder(a, b, c, d) {
    return this.IsRectangle(a, b, c, d) || this.IsRectangle(b, c, a, d) || this.IsRectangle(c, a, b, d);
  }

  isSquare(p1, p2, p3, p4) {

    let distSq = (p, q) => {
      return (p.x - q.x) * (p.x - q.x) +
        (p.y - q.y) * (p.y - q.y);
    }


    let d2 = distSq(p1, p2);  // from p1 to p2
    let d3 = distSq(p1, p3);  // from p1 to p3
    let d4 = distSq(p1, p4);  // from p1 to p4


    let s1 = distSq(p1, p2);
    let s2 = distSq(p2, p3);
    let s3 = distSq(p3, p4);
    let s4 = distSq(p4, p1);

    let allSidesSame: boolean = s1 === s2 && s2 === s3 && s3 === s4;
    console.log("All Sides Same ", allSidesSame);
    // If lengths if (p1, p2) and (p1, p3) are same, then
    // following conditions must met to form a square.
    // 1) Square of length of (p1, p4) is same as twice
    //    the square of (p1, p2)
    // 2) p4 is at same distance from p2 and p3
    if (d2 == d3 && 2 * d2 == d4) {
      let d = distSq(p2, p4);
      return (d == distSq(p3, p4) && d == d2);
    }

// The below two cases are similar to above case
    if (d3 == d4 && 2 * d3 == d2) {
      let d = distSq(p2, p3);
      return (d == distSq(p2, p4) && d == d3);
    }
    if (d2 == d4 && 2 * d2 == d3) {
      let d = distSq(p2, p3);
      return (d == distSq(p3, p4) && d == d2);
    }

    return false;
  }


}


export class SketchSymbol extends SketchDocument {


  constructor(document: SketchDocument, symbolId: string) {
    super();

    //let pageClone: any = JSON.parse(JSON.stringify(document.pages[0]));
    //this.analyzeInitialLayer(pageClone,)


  }


}
