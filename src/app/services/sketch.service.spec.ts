import { TestBed, inject } from '@angular/core/testing';

import { SketchService } from './sketch.service';

describe('SketchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SketchService]
    });
  });

  it('should ...', inject([SketchService], (service: SketchService) => {
    expect(service).toBeTruthy();
  }));
});
