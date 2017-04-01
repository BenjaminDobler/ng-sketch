import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class SketchService {


  private JSZip: any;
  zip: any;

  public images: Array<string> = [];
  imageDataUrl: any;
  pages: Array<any> = [];

  private fs: any;

  page:any;

  loadedImages:Array<any> = [];



  constructor(private zone: NgZone) {

  }


  public loadFile() {
    let w: any = window;
    const electron = w.nodeRequire('electron');
    this.fs = w.nodeRequire('fs');
    this.JSZip = w.nodeRequire('jszip');

    electron.remote.dialog.showOpenDialog({title: 'Select Skecth file'}, (file) => {
      console.log('file', file);
      this.readSketchFile(file[0]);
    });

  }


  private readSketchFile(path: string) {
    this.fs.readFile(path, (err, data) => {
      if (err) throw err;
      this.JSZip.loadAsync(data).then((zip) => {
        this.zip = zip;
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
                  this.pages.push({
                    data: json,
                    file: key
                  });
                });
              });
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
