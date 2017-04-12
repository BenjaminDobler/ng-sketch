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


  constructor() {
    const w: any = window;
    this.electron = w.nodeRequire('electron');
    this.fs = w.nodeRequire('fs');
    this.JSZip = w.nodeRequire('jszip');
  }


  openDialog() {
    let promise = new Promise((resolve, reject)=> {
      this.electron.remote.dialog.showOpenDialog({title: 'Select Skecth file'}, (file) => {
        this.fs.readFile(file[0], (err, data) => {
          if (err) {
            throw err
          }
          ;
          this.readFile(data).then((data) => {
            console.log("Radddddd", data);
            resolve(data);
          });
        });
      });
    });
    return promise;
  }


  readFile(data) {

    let resultData:any = {};

    return this.JSZip.loadAsync(data).then((zip) => {
      this.zip = zip;

      const pages: Array<string> = Object.keys(zip.files).filter(x => x.startsWith('pages'));
      const images: Array<string> = Object.keys(zip.files).filter(x => x.endsWith('png'));
      resultData.pageKeys = pages;
      resultData.imageKeys = images;


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



        return resultData;

      });

    });
  }


}
