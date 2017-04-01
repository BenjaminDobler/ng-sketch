import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchNavigationComponent } from './sketch-navigation.component';

describe('SketchNavigationComponent', () => {
  let component: SketchNavigationComponent;
  let fixture: ComponentFixture<SketchNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
