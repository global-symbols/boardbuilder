import {TestBed} from '@angular/core/testing';

import {GlobalSymbolsService} from './global-symbols.service';

describe('GlobalSymbolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalSymbolsService = TestBed.get(GlobalSymbolsService);
    expect(service).toBeTruthy();
  });
});
