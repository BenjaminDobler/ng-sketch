import {EventEmitter} from '@angular/core';
/**
 * Created by benjamindobler on 11.04.17.
 */


export interface SketchLoaderPage {
  data: any;
  file: string;
}


export interface SketchLoaderResult {
  fileName: string;
  filePath: string;
  imageKeys: Array<string>;
  imageMap: Array<any>;
  pageKeys: Array<string>;
  pageMap: Array<any>;
  pages: Array<SketchLoaderPage>;
}


export class SketchLoader {


  private JSZip: any;
  private zip: any;
  private fs: any;
  private electron: any;
  private imageMap: any = {};
  private pageMap: any = {};
  public onFileChanged: EventEmitter<any> = new EventEmitter<any>();
  public filePath: string;
  public path: any;


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
          throw err;
        }
        this.readFile(data).then((data) => {
          this.onFileChanged.emit(data);
        });
      });
    });
  }


  openDialog(): Promise<SketchLoaderResult> {
    const promise = new Promise((resolve, reject) => {
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

  load(url: string) {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.open('GET', url, true);
      oReq.responseType = 'arraybuffer';

      oReq.onload = (oEvent) => {
        const arrayBuffer = oReq.response; // Note: not oReq.responseText
        this.filePath = url;
        console.log('Loaded ', arrayBuffer);
        this.readFile(arrayBuffer).then((data) => {
          resolve(data);
        });
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

      const pagePromises = pages.map(x => this.zip.file(x).async('string'));
      const imagePromises = images.map(x => this.zip.file(x).async('base64'));

      const allImages = Promise.all(imagePromises)
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

        return resultData;

      });

    });
  }


}
