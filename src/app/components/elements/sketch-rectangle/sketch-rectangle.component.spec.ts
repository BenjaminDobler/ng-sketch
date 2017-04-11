import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchRectangleComponent } from './sketch-rectangle.component';

describe('SketchRectangleComponent', () => {
  let component: SketchRectangleComponent;
  let fixture: ComponentFixture<SketchRectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchRectangleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
