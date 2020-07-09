import { TestBed } from '@angular/core/testing';

import { SampleAuthService } from './sample-auth.service';

describe('SampleAuthService', () => {
  let service: SampleAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SampleAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
