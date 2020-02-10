import { TestBed } from '@angular/core/testing';

import { OpenSymbolsService } from './open-symbols.service';

describe('OpenSymbolsService', () => {
  let service: OpenSymbolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenSymbolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
