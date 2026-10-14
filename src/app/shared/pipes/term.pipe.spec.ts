import {TermPipe} from './term.pipe';
import {BoardSet} from '@data/models/boardset.model';

describe('TermPipe', () => {
  const pipe = new TermPipe();
  const book = new BoardSet({ kind: 'book', book_columns: 3, book_rows: 4 });
  const boardSet = new BoardSet({ name: 'Set' });

  it('uses board set wording for board sets and when nothing is loaded', () => {
    expect(pipe.transform('board', boardSet)).toBe('Board');
    expect(pipe.transform('boards', boardSet)).toBe('Boards');
    expect(pipe.transform('boardSet', boardSet)).toBe('Board Set');
    expect(pipe.transform('boardSets', undefined)).toBe('Board Sets');
  });

  it('uses page and book wording for books', () => {
    expect(pipe.transform('board', book)).toBe('Page');
    expect(pipe.transform('boards', book)).toBe('Pages');
    expect(pipe.transform('boardSet', book)).toBe('Book');
    expect(pipe.transform('boardSets', book)).toBe('Books');
  });
});
