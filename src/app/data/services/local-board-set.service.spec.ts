import { TestBed } from '@angular/core/testing';

import { LocalBoardSetService } from './local-board-set.service';

describe('BoardSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalBoardSetService = TestBed.get(LocalBoardSetService);
    expect(service).toBeTruthy();
  });
});
