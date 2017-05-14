import {EventEmitter} from "@angular/core";
/**
 * Created by benjamindobler on 11.04.17.
 */


export class SketchLoader {


  private JSZip: any;
  private zip: any;
  private fs: any;
  private electron: any;
  private imageMap: any = {};
  private pageMap: any = {};
  public onFileChanged: EventEmitter<any> = new EventEmitter<any>();
  public filePath:string;
  public path:any;


  constructor() {
    const w: any = window;
    this.electron = w.nodeRequire('electron');
    this.fs = w.nodeRequire('fs');
    this.JSZip = w.nodeRequire('jszip');
    this.path = w.nodeRequire('path');
  }


  watchFile(filePath: string) {
    this.fs.watchFile(filePath, {interval: 1, persistent: true}, (event, filename) => {
      console.log(filename + ' file Changed ...');
      this.filePath = filePath;

      this.fs.readFile(filePath, (err, data) => {

        if (err) {
          throw err
        }
        ;
        this.readFile(data).then((data) => {
          // resolve(data);
          this.onFileChanged.emit(data);
        });
      });
      if (filename) {
        //file = fs.readFileSync(filePath);
        //console.log('File content at : ' + new Date() + ' is \n' + file);
        //this.watchFile(filePath);

      }
      else {
        console.log('filename not provided')
      }
    });
  }


  openDialog() {
    let promise = new Promise((resolve, reject) => {
      this.electron.remote.dialog.showOpenDialog({title: 'Select Skecth file'}, (file) => {
        this.watchFile(file[0]);
        this.fs.readFile(file[0], (err, data) => {
          this.filePath = file[0];

          if (err) {
            throw err;
          }

          this.readFile(data).then((data) => {
            resolve(data);
          });
        });
      });
    });
    return promise;
  }

  load(url:string) {
    return new Promise((resolve, reject)=>{
      console.log("Load")
      var oReq = new XMLHttpRequest();
      oReq.open("GET", url, true);
      oReq.responseType = "arraybuffer";

      oReq.onload =  (oEvent)=> {

        var arrayBuffer = oReq.response; // Note: not oReq.responseText
        this.filePath = url;
        console.log("Loaded ", arrayBuffer);
        this.readFile(arrayBuffer).then((data)=>{
          resolve(data);
        });
        /*
         if (arrayBuffer) {
         var byteArray = new Uint8Array(arrayBuffer);
         for (var i = 0; i < byteArray.byteLength; i++) {
         // do something with each byte in the array
         }
         }
         */
      };
      oReq.send(null);
    });


  }


  readFile(data) {

    const resultData: any = {};

    return this.JSZip.loadAsync(data).then((zip) => {
      this.zip = zip;

      const pages: Array<string> = Object.keys(zip.files).filter(x => x.startsWith('pages'));
      const images: Array<string> = Object.keys(zip.files).filter(x => x.endsWith('png'));
      resultData.pageKeys = pages;
      resultData.imageKeys = images;
      resultData.filePath = this.filePath;
      resultData.fileName = this.path.basename(this.filePath);
      console.log("Pages ", pages);


      let pagePromises = pages.map(x => this.zip.file(x).async('string'));
      let imagePromises = images.map(x => this.zip.file(x).async('base64'));

      let allImages = Promise.all(imagePromises)
        .then((data) => {
          images.forEach((key: string, index: number) => {
            this.imageMap[key] = 'data:image/jpeg;base64,' + data[index];
          });
          resultData.imageMap = this.imageMap;
        });

      return allImages.then(x => Promise.all(pagePromises)).then((pageData) => {
        pages.forEach((key: string, index: number) => {
          this.pageMap[key] = JSON.parse(pageData[index]);
          resultData.pageMap = this.pageMap;
        });


        resultData.pages = pages.map((pageKey) => {
          return {
            data: this.pageMap[pageKey],
            file: pageKey
          };
        });

        console.log("Result Data ", resultData);

        return resultData;

      });

    });
  }


}
