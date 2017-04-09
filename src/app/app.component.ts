import {Component, NgZone} from '@angular/core';
import {SketchService} from "./services/sketch.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {




  constructor(private zone: NgZone, private sketchService:SketchService) {
  }


  getSelectedLayer() {
    return JSON.stringify(this.sketchService.highlightedLayer, null, 4);
    /*
    if (this.sketchService.highlightedLayer) {
      let clone = JSON.parse(JSON.stringify(this.sketchService.highlightedLayer));
      if (clone.layers) {
        for(var i in clone.layers) {
          delete clone.layers[i].parent;
          if (clone.layers[i].layers) {
            for(var y in clone.layers[i].layers) {
              delete clone.layers[i].layers[y].parent;
            }
          }
        }
      }
      console.log("Clone", clone)
      return JSON.stringify(clone);
    }
    return "";
    */
  }

/*
  showImage(key) {
    this.zip.file(key).async("base64")
      .then((data64) => {
        this.imageDataUrl = "data:image/jpeg;base64," + data64;

      });
  }




  onPage(data: any) {
    console.log(data.data);
    this.page = data;
  }

  logLayer(layer) {
    console.log(layer);
  }






  loadedImages: any = {};
  loadingImages: any = {};


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
