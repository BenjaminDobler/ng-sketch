import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ShapeComponent } from './components/shape/shape.component';
import { LayerComponent } from './components/layer/layer.component';
import { SketchNavigationComponent } from './components/sketch-navigation/sketch-navigation.component';
import { SketchCanvasComponent } from './components/sketch-canvas/sketch-canvas.component';
import {SketchService} from "./services/sketch.service";

@NgModule({
  declarations: [
    AppComponent,
    ShapeComponent,
    LayerComponent,
    SketchNavigationComponent,
    SketchCanvasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SketchService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
