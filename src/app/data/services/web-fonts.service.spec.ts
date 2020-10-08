import { TestBed } from '@angular/core/testing';

import { WebFontsService } from './web-fonts.service';

describe('WebFontsService', () => {
  let service: WebFontsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebFontsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
