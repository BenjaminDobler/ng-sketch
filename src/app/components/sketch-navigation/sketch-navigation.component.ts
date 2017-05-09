import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {SketchService} from "../../services/sketch.service";
import {DragAndDropUtil} from "../utils/drag-drop.util";

@Component({
  selector: 'sketch-navigation',
  templateUrl: './sketch-navigation.component.html',
  styleUrls: ['./sketch-navigation.component.css']
})
export class SketchNavigationComponent implements OnInit, AfterViewInit {



  @Input()
  public pages: any;

  @Input()
  public documents: any;


  constructor(private sketchService:SketchService, private el:ElementRef) {
  }

  ngAfterViewInit(): void {
    const dd:DragAndDropUtil = new DragAndDropUtil(this.el.nativeElement);
    let startWidth:number = this.el.nativeElement.clientWidth;
    dd.mousedown.subscribe(()=>{
      startWidth = this.el.nativeElement.clientWidth;
    });
    dd.mousedrag.subscribe((e:any)=>{
      console.log(e);
      let newWidth = startWidth + e.deltaX;
      this.el.nativeElement.style.width = newWidth + 'px';
    });
  }

  ngOnInit() {
  }

  onPage(page) {
    //this.sketchService.page = page;
    //this.sketchService.rootLayers = [page.data];
  }

  highlight(layer) {
    //this.sketchService.highlightedLayer = layer;

  }


  getFileIcon(cl) {
    if (cl === 'bitmap') {
      return 'assets/icons/file-picture.svg';
    }
    return '';
  }

}
