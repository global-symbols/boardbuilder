import { TestBed } from '@angular/core/testing';

import { ObfObzService } from './obf-obz.service';

describe('ObfObzService', () => {
  let service: ObfObzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObfObzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
