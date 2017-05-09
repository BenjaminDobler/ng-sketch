import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SketchNavigationComponent } from './components/sketch-navigation/sketch-navigation.component';
import { SketchCanvasComponent } from './components/sketch-canvas/sketch-canvas.component';
import { SketchService } from './services/sketch.service';
import { SketchInfoComponent } from './components/sketch-info/sketch-info.component';
import {SketchNavigationLayerComponent} from './components/sketch-navigation-layer/sketch-navigation-layer.component';

@NgModule({
  declarations: [
    AppComponent,
    SketchNavigationComponent,
    SketchCanvasComponent,
    SketchInfoComponent,
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
