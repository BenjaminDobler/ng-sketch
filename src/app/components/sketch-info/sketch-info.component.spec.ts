import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchInfoComponent } from './sketch-info.component';

describe('SketchInfoComponent', () => {
  let component: SketchInfoComponent;
  let fixture: ComponentFixture<SketchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
