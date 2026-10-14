import {BoardSet} from './boardset.model';
import {Cell} from './cell.model';

describe('BoardSet (books)', () => {
  it('is a board set unless kind is book', () => {
    expect(new BoardSet({ name: 'Set' }).isBook).toBeFalse();
    expect(new BoardSet({ name: 'Set' }).kind).toBe('board_set');
    expect(new BoardSet({ name: 'Book', kind: 'book', book_columns: 6, book_rows: 6 }).isBook).toBeTrue();
  });

  it('counts the cells per book page', () => {
    expect(new BoardSet({ kind: 'book', book_columns: 3, book_rows: 4 }).bookCellCount).toBe(12);
    expect(new BoardSet({ kind: 'board_set' }).bookCellCount).toBeNull();
  });

  it('orders pages by index and keeps the back page apart', () => {
    const book = new BoardSet().deserialise({
      kind: 'book', book_columns: 3, book_rows: 4,
      boards: [
        { id: 3, name: 'Second', index: 1, role: 'page', rows: 4, columns: 3 },
        { id: 9, name: 'Core Words', index: null, role: 'back_page', back_page_type: 'core_words', rows: 4, columns: 3 },
        { id: 2, name: 'First', index: 0, role: 'page', rows: 4, columns: 3,
          tab_cell: { id: 20, caption: 'Pets' } as Cell }
      ] as any
    });

    expect(book.pages.map(page => page.name)).toEqual(['First', 'Second']);
    expect(book.backPage.back_page_type).toBe('core_words');
    expect(book.pages[0].tab_cell instanceof Cell).toBeTrue();
    expect(book.pages[0].tab_cell.caption).toBe('Pets');
  });

  it('has no back page by default', () => {
    expect(new BoardSet({ kind: 'book', book_columns: 3, book_rows: 4 }).backPage).toBeUndefined();
  });
});
