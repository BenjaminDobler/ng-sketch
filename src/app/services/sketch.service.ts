import {Injectable, NgZone} from '@angular/core';
import {NSArchiveParser} from './NSArchiveParser';
import {SketchLoader} from './sketch.loader';
import {SketchDocument} from './sketch.document';

@Injectable()
export class SketchService {

  rootLayers: Array<any> = [];
  highlightedLayer: any;
  sketchLoader: SketchLoader;

  public selectedSymbolId: string;


  constructor(private zone: NgZone) {

  }


  documents: Array<any> = [];
  public selectedDocument: SketchDocument;


  public loadFile() {

    this.sketchLoader = new SketchLoader();

    /*
     this.sketchLoader.onFileChanged.subscribe((data:any)=>{
     data.pages.forEach((page, pageNum) => {
     //page.data.$$level = 0;
     this.findSymbolMasters(page.data);
     });

     data.pages.forEach((page, pageNum) => {
     //page.data.$$level = 0;
     this.fillSymbolInstances(page.data);
     });

     data.pages.forEach((page, pageNum) => {
     page.data.$$level = 0;
     this.analyzePage(page.data, 1, null, pageNum + '', '');
     });
     this.pages = data.pages;
     this.loadedImages = data.imageMap;
     this.zone.run(() => {
     this.selectPage(this.pages[0]);
     });
     });
     */


    this.sketchLoader.openDialog()
      .then((data: any) => {

        const doc: SketchDocument = new SketchDocument(data);
        this.documents.push(doc);
        this.selectedDocument = doc;


        this.selectedDocument.getSymbolDoc('testid');

      });
  }

}
