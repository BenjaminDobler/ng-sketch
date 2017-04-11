import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchTextComponent } from './sketch-text.component';

describe('SketchTextComponent', () => {
  let component: SketchTextComponent;
  let fixture: ComponentFixture<SketchTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
