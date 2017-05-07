import {Component, ComponentFactory, ComponentFactoryResolver, NgZone} from '@angular/core';
import {SketchService} from "./services/sketch.service";
import {SketchNavigationLayerComponent} from "./components/sketch-navigation-layer/sketch-navigation-layer.component";

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
