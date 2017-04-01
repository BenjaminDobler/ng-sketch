import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css']
})
export class ShapeComponent implements OnInit {

  @Input()
  set data(value: any) {

    this.parseData(value);

    //this._data = value;
  }


  constructor() { }

  ngOnInit() {
  }

  parseData(data:any) {

  }

}
