import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchNavigationLayerComponent } from './sketch-navigation-layer.component';

describe('SketchNavigationLayerComponent', () => {
  let component: SketchNavigationLayerComponent;
  let fixture: ComponentFixture<SketchNavigationLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchNavigationLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchNavigationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
