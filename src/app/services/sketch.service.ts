import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class SketchService {


  private JSZip: any;
  zip: any;

  public images: Array<string> = [];
  imageDataUrl: any;
  pages: Array<any> = [];

  private fs: any;

  page: any;

  rootLayers:Array<any> = [];

  loadedImages: Array<any> = [];

  highlightedLayer:any;


  constructor(private zone: NgZone) {

  }


  public loadFile() {
    this.page = null;
    this.rootLayers = [];
    this.pages = [];
    let w: any = window;
    const electron = w.nodeRequire('electron');
    this.fs = w.nodeRequire('fs');
    this.JSZip = w.nodeRequire('jszip');

    electron.remote.dialog.showOpenDialog({title: 'Select Skecth file'}, (file) => {
      this.readSketchFile(file[0]);
    });

  }


  generateId(level) {

  }


  colorToHex(color: any) {
    const r: number = Math.round(color.red * 255);
    const g: number = Math.round(color.green * 255);
    const b: number = Math.round(color.blue * 255);
    const hex: string = (r << 16 | g << 8 | b).toString(16).toUpperCase();
    return '#' + hex;
  }

  toPoint(p: any) {
    p = p.substring(1);
    p = p.substring(0, p.length - 1);
    p = p.split(',');


    return {
      x: Number(p[0].trim()) ,
      y: Number(p[1].trim())
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

  private analyzePage(data: any, parent: any, level: string, maskId:string) {

    data.masks = [];
    data.parent = parent;
    data.maskId = maskId;
    data.id = level;

    if (data.style && data.style.fills && data.style.fills.length > 0 ) {
      if (data.style.fills[0].gradient) {
        console.log("Has gradient! ")

        let gradient = data.style.fills[0].gradient;
        let linearGradient:any = {};
        let from = this.toPoint(gradient.from);
        let to = this.toPoint(gradient.to);
        linearGradient.x1 = from.x * 100 + "%";
        linearGradient.x2 = to.x * 100 + "%";
        linearGradient.y1 = from.y * 100 + "%";
        linearGradient.y2 = to.y * 100 + "%";
        linearGradient.stops = [];
        linearGradient.id = 'gradient-' + data.id;

        gradient.stops.forEach((stop)=>{
          let hex:string = this.colorToHex(stop.color);
          linearGradient.stops.push({
            color: hex,
            offset: stop.position*100+"%",
            opacity: stop.color.alpha
          });

        });

        data.gradients = [linearGradient];



      }
    }

    console.log("Data ", data);



    for (let i in data) {

      if (i === 'layers') {
        let hasClippingMask = false;
        let mId:string = "";
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
    this.fs.readFile(path, (err, data) => {
      if (err) throw err;
      this.JSZip.loadAsync(data).then((zip) => {
        this.zip = zip;
        let pageNum = 0;
        // zip contains a json file that describes all the directory & files in the zip file
        Object.keys(zip.files).forEach((key: string) => {
          console.log(key);

          if (key.startsWith('pages')) {
            console.log("Pages ", key);
            this.zip.file(key).async("string")
              .then((data) => {
                console.log("Data", data);
                let json = JSON.parse(data);
                this.zone.run(() => {
                  this.analyzePage(json, null, pageNum + "", "");
                  console.log("Analyzed Data ", json);
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


  }


  loadImage(id) {
    this.zip.file(id).async("base64")
      .then((data64) => {
        this.loadedImages[id] = "data:image/jpeg;base64," + data64;
      });

  }


  /*
   getImageData(layer) {
   console.log("Ref ", layer.image._ref);


   if (this.loadedImages[layer.image._ref]) {
   return this.loadedImages[layer.image._ref];
   } else {
   if (!this.loadingImages[layer.image._ref]) {
   this.loadingImages[layer.image._ref] = true;
   this.zip.file(layer.image._ref + '.png').async("base64")
   .then((data64) => {
   //this.imageDataUrl = "data:image/jpeg;base64," + data64;
   this.loadedImages[layer.image._ref] = "data:image/jpeg;base64," + data64;

   });
   }
   return "";
   }
   }
   */

}
