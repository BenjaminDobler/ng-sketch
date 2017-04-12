import {Component, NgZone} from '@angular/core';
import {SketchService} from "./services/sketch.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private zone: NgZone, private sketchService: SketchService) {
  }


  getSelectedLayer() {
    return JSON.stringify(this.sketchService.highlightedLayer, null, 4);
  }


}
