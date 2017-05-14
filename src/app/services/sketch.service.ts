import {Injectable, NgZone} from '@angular/core';
import {NSArchiveParser} from './NSArchiveParser';
import {SketchLoader} from './sketch.loader';
import {SketchDocument} from './sketch.document';

@Injectable()
export class SketchService {

  highlightedLayer: any;

  public selectedSymbolId: string;


  constructor(private zone: NgZone) {

  }


  documents: Array<any> = [];
  public selectedDocument: SketchDocument;


  public loadFile() {

    const sketchLoader = new SketchLoader();


    /*
    this.sketchLoader.load("assets/multiple.sketch").then((data: any) => {

      const doc: SketchDocument = new SketchDocument(data);
      this.documents.push(doc);
      this.selectedDocument = doc;
      this.selectedDocument.getSymbolDoc('testid');

    });
    */


    const doc: SketchDocument = new SketchDocument();


    sketchLoader.openDialog()
      .then((data: any) => {
        doc.setData(data);
        this.documents.push(doc);
        this.selectedDocument = doc;
      });

    sketchLoader.onFileChanged.subscribe((data:any)=>{
      this.zone.run(()=>{
        doc.setData(data);
      });

    });

  }

}
