import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sketch-canvas',
  templateUrl: './sketch-canvas.component.html',
  styleUrls: ['./sketch-canvas.component.css']
})
export class SketchCanvasComponent implements OnInit {


  @Input()
  public page: any;

  constructor() {
  }

  ngOnInit() {
  }

}
