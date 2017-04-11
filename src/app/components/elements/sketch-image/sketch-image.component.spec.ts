import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchImageComponent } from './sketch-image.component';

describe('SketchImageComponent', () => {
  let component: SketchImageComponent;
  let fixture: ComponentFixture<SketchImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
