import { TestBed } from '@angular/core/testing';

import { BoardSetService } from './board-set.service';

describe('BoardSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardSetService = TestBed.get(BoardSetService);
    expect(service).toBeTruthy();
  });
});
