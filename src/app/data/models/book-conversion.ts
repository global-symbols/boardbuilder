import {Board} from './board.model';
import {BOOK_LAYOUTS} from './boardset.model';

// Converting a board set into a book (D40): how each board fits a book page of the chosen layout.
// - same:    the board already has the book layout.
// - reflow:  a different layout with no more cells than a page; cells fill the page in order (positions change).
// - too_big: more cells than a page; it can only be left out.
export type BookFit = 'same' | 'reflow' | 'too_big';

export function bookFit(board: Board, columns: number, rows: number): BookFit {
  if (board.columns === columns && board.rows === rows) { return 'same'; }
  return board.columns * board.rows <= columns * rows ? 'reflow' : 'too_big';
}

// Links between boards are dropped in a book (D13).
export function hasLinks(board: Board): boolean {
  return (board.cells || []).some(cell => !!cell.linked_board_id);
}

// The book layout most boards already fit without change (ties: the smaller layout).
export function suggestedBookLayout(boards: Board[]): { columns: number, rows: number } {
  const score = (layout: { columns: number, rows: number }) =>
    boards.filter(board => bookFit(board, layout.columns, layout.rows) === 'same').length * 1000 +
    boards.filter(board => bookFit(board, layout.columns, layout.rows) === 'reflow').length;
  return BOOK_LAYOUTS.reduce((best, layout) => score(layout) > score(best) ? layout : best, BOOK_LAYOUTS[0]);
}
