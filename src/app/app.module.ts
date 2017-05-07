import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ShapeComponent } from './components/shape/shape.component';
import { LayerComponent } from './components/layer/layer.component';
import { SketchNavigationComponent } from './components/sketch-navigation/sketch-navigation.component';
import { SketchCanvasComponent } from './components/sketch-canvas/sketch-canvas.component';
import { SketchService } from "./services/sketch.service";
import { SketchInfoComponent } from './components/sketch-info/sketch-info.component';
import {SketchRectangleComponent} from "./components/elements/sketch-rectangle/sketch-rectangle.component";
import {SketchTextComponent} from "./components/elements/sketch-text/sketch-text.component";
import { SketchImageComponent } from './components/elements/sketch-image/sketch-image.component';
import {SketchNavigationLayerComponent} from "./components/sketch-navigation-layer/sketch-navigation-layer.component";

@NgModule({
  declarations: [
    AppComponent,
    ShapeComponent,
    LayerComponent,
    SketchNavigationComponent,
    SketchCanvasComponent,
    SketchInfoComponent,
    SketchRectangleComponent,
    SketchTextComponent,
    SketchImageComponent,
    SketchNavigationLayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SketchService],
  bootstrap: [AppComponent],
  entryComponents: [
    SketchNavigationLayerComponent
  ]
})
export class AppModule { }
