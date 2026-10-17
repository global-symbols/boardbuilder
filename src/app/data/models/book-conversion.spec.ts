import {Board} from './board.model';
import {bookFit, hasLinks, suggestedBookLayout} from './book-conversion';

describe('book conversion', () => {
  const board = (columns: number, rows: number, linked = false) =>
    new Board({ columns, rows, cells: linked ? [{ linked_board_id: 9 }] as any : [] });

  it('a board with the book layout is compatible', () => {
    expect(bookFit(board(3, 4), 3, 4)).toBe('same');
  });

  it('a different layout with no more cells is compatible with a warning (re-flowed)', () => {
    expect(bookFit(board(4, 3), 3, 4)).toBe('reflow');
    expect(bookFit(board(2, 2), 6, 6)).toBe('reflow');
    expect(bookFit(board(4, 3), 6, 6)).toBe('reflow');
  });

  it('a board with more cells than a page is not compatible (grid size)', () => {
    expect(bookFit(board(4, 4), 3, 4)).toBe('too_big');
    expect(bookFit(board(7, 6), 6, 6)).toBe('too_big');
  });

  it('notices links to other boards', () => {
    expect(hasLinks(board(3, 4, true))).toBeTrue();
    expect(hasLinks(board(3, 4))).toBeFalse();
  });

  it('suggests the layout most boards already have', () => {
    expect(suggestedBookLayout([board(6, 6), board(6, 6), board(3, 4)])).toEqual({ columns: 6, rows: 6 });
    expect(suggestedBookLayout([board(3, 4), board(2, 2)])).toEqual({ columns: 3, rows: 4 });
    expect(suggestedBookLayout([board(5, 5)])).toEqual({ columns: 6, rows: 6 });
  });
});
