import {TestBed} from '@angular/core/testing';

import {BoardSetService} from './board-set.service';

describe('BoardSetService', () => {
  let service: BoardSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
