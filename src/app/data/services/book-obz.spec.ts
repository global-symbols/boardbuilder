import * as JSZip from 'jszip';
import {of} from 'rxjs';
import {BoardSetService} from './board-set.service';
import {ObfObzService} from './obf-obz.service';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';

// Book OBZ (book/BOOK-OBZ-FORMAT.md): download → import gives the same book; board-set OBZ is unchanged apart from ids.
describe('Book OBZ', () => {
  const boardSetService = new BoardSetService({} as any);
  const media = { add: jasmine.createSpy('add').and.callFake(() => of({ id: 77, public_url: 'https://example.test/uploaded.png' })) };
  const obz = new ObfObzService(media as any, boardSetService, {} as any);

  function book(columns: number, rows: number, pageCount: number, withBackPage: boolean): BoardSet {
    let cellId = 1;
    const cells = (prefix: string) => Array.from({ length: columns * rows }, (_, i) => ({
      id: cellId++, caption: `${prefix} ${i + 1}`, image_url: i === 0 ? `https://example.test/${prefix}.svg` : null,
      background_colour: i === 1 ? '#FFCC00' : null
    }));
    const boards: any[] = [];
    for (let i = pageCount - 1; i >= 0; i--) {
      boards.push({
        id: 100 + i, name: `Page ${i + 1}`, index: i, role: 'page', rows, columns, captions_position: 'below',
        cells: cells(`p${i + 1}`),
        tab_cell: {
          id: 900 + i, kind: 'tab', caption: `Tab ${i + 1}`,
          image_url: i === 0 ? 'https://example.test/tab.svg' : null,
          background_colour: i === 0 ? 'rgb(68, 114, 196)' : null, text_colour: i === 0 ? '#FFFFFF' : null
        }
      });
    }
    if (withBackPage) {
      boards.push({ id: 199, name: 'Core Words', role: 'back_page', back_page_type: 'core_words', rows, columns, cells: cells('core') });
    }
    return new BoardSet().deserialise({ id: 1, name: 'Ali book', kind: 'book', book_columns: columns, book_rows: rows, boards });
  }

  const asFile = (blob: Blob, name = 'book.obz') => new File([blob], name);

  async function roundTrip(source: BoardSet): Promise<BoardSet> {
    return obz.parseObz(asFile(await boardSetService.convertBookToObz(source)));
  }

  async function zipWith(manifest: any, boards: { [id: string]: any }): Promise<File> {
    const zip = new JSZip();
    zip.file('manifest.json', JSON.stringify(manifest));
    Object.entries(boards).forEach(([id, obf]) => zip.file(`boards/${id}.obf`, JSON.stringify(obf)));
    return asFile(await zip.generateAsync({ type: 'blob' }));
  }

  function expectSameBook(copy: BoardSet, source: BoardSet) {
    expect(copy.isBook).toBeTrue();
    expect(copy.name).toBe(source.name);
    expect([copy.book_columns, copy.book_rows]).toEqual([source.book_columns, source.book_rows]);
    expect(copy.pages.length).toBe(source.pages.length);
    copy.boards.filter(b => b.role === 'page').forEach((page, i) => {
      const original = source.pages[i];
      expect(page.name).toBe(original.name);
      expect([page.rows, page.columns]).toEqual([original.rows, original.columns]);
      expect(page.cells.map(c => c.caption)).toEqual(original.cells.map(c => c.caption));
      expect(page.cells.map(c => c.image_url || null)).toEqual(original.cells.map(c => c.image_url || null));
      expect(page.tab_cell.caption).toBe(original.tab_cell.caption);
      expect(page.tab_cell.image_url || null).toBe(original.tab_cell.image_url || null);
      expect(page.tab_cell.background_colour || null).toBe(original.tab_cell.background_colour || null);
      expect(page.tab_cell.text_colour || null).toBe(original.tab_cell.text_colour || null);
    });
    if (source.backPage) {
      expect(copy.backPage.back_page_type).toBe(source.backPage.back_page_type);
      expect(copy.backPage.cells.map(c => c.caption)).toEqual(source.backPage.cells.map(c => c.caption));
    } else {
      expect(copy.backPage).toBeUndefined();
    }
  }

  it('round trips a 12-cell book with a back page', async () => {
    const source = book(3, 4, 3, true);
    expectSameBook(await roundTrip(source), source);
  });

  it('round trips a 36-cell book without a back page', async () => {
    const source = book(6, 6, 2, false);
    expectSameBook(await roundTrip(source), source);
  });

  it('writes the book settings and page fields from the contract', async () => {
    const zip = await JSZip.loadAsync(await boardSetService.convertBookToObz(book(3, 4, 5, true)));
    const manifest = JSON.parse(await zip.file('manifest.json').async('string'));
    const fifth = JSON.parse(await zip.file('boards/104.obf').async('string'));
    const back = JSON.parse(await zip.file('boards/199.obf').async('string'));
    const first = JSON.parse(await zip.file('boards/100.obf').async('string'));

    expect(manifest.root).toBe('boards/100.obf');
    expect(manifest.ext_globalsymbols_book).toEqual(jasmine.objectContaining({
      format: 'book-0.1', name: 'Ali book', layout: { columns: 3, rows: 4 },
      pages: ['100', '101', '102', '103', '104'], back_page: { id: '199', type: 'core_words' },
      tabs: { edge: 'right', width_ratio: 0.667, placement: 'row_cycle' }
    }));
    expect(fifth.ext_globalsymbols_book_page).toEqual({ role: 'page', number: 5, tab_row: 1 });
    expect(back.ext_globalsymbols_book_page).toEqual({ role: 'back_page', type: 'core_words' });
    expect(back.ext_globalsymbols_book_tab).toBeUndefined();
    expect(first.ext_globalsymbols_book_tab).toEqual({
      id: '100-tab', label: 'Tab 1', image_id: '100-tab', background_color: 'rgb(68, 114, 196)', text_color: '#FFFFFF'
    });
    expect(first.images.find(image => image.id === '100-tab').url).toBe('https://example.test/tab.svg');
    expect(first.grid.order.flat()).not.toContain('100-tab');
  });

  it('uses ids unique across the whole OBZ (board-cell), for board sets too', async () => {
    const set = new BoardSet().deserialise({ id: 2, name: 'Set', boards: [
      { id: 1, name: 'A', rows: 1, columns: 1, cells: [{ id: 23, caption: 'a' }] },
      { id: 12, name: 'B', rows: 1, columns: 1, cells: [{ id: 3, caption: 'b' }] }
    ] as any });
    const zip = await JSZip.loadAsync(await boardSetService.convertToObz(set));
    const ids = [];
    for (const path of ['boards/1.obf', 'boards/12.obf']) {
      ids.push(...JSON.parse(await zip.file(path).async('string')).images.map(image => image.id));
    }

    expect(ids).toEqual(['1-23', '12-3']);
    const copy = await obz.parseObz(asFile(await boardSetService.convertToObz(set)));
    expect(copy.isBook).toBeFalse();
    expect(copy.boards.map(b => b.cells[0].caption)).toEqual(['a', 'b']);
  });

  it('still imports an OBZ written with the old joined ids', async () => {
    const old = (id: string, label: string) => ({
      format: 'open-board-0.1', id, name: `Board ${id}`, buttons: [{ id: `${id}23`, image_id: `${id}23`, label }],
      grid: { rows: 1, columns: 1, order: [[`${id}23`]] }, images: [{ id: `${id}23`, url: null, content_type: null }]
    });
    const manifest = { format: 'open-board-0.1', root: 'boards/1.obf', paths: { boards: { 1: 'boards/1.obf', 12: 'boards/12.obf' } } };
    const file = await zipWith(manifest, { 1: old('1', 'one'), 12: old('12', 'two') });

    const set = await obz.parseObz(file);
    expect(set.isBook).toBeFalse();
    expect(set.boards.map(b => b.cells[0].caption)).toEqual(['one', 'two']);
  });

  describe('problems', () => {
    async function bookFile(change: (manifest: any, boards: any) => void): Promise<File> {
      const zip = await JSZip.loadAsync(await boardSetService.convertBookToObz(book(3, 4, 2, true)));
      const manifest = JSON.parse(await zip.file('manifest.json').async('string'));
      const boards = {};
      for (const id of ['100', '101', '199']) { boards[id] = JSON.parse(await zip.file(`boards/${id}.obf`).async('string')); }
      change(manifest, boards);
      return zipWith(manifest, boards);
    }

    it('names the board and its size when a board does not match the book layout', async () => {
      const file = await bookFile((_, boards) => {
        boards['101'].grid = { rows: 2, columns: 2, order: [[null, null], [null, null]] };
      });

      await expectAsync(obz.parseObz(file)).toBeRejectedWithError(/"Page 2" is 2 columns × 2 rows; this book is 3 columns × 4 rows/);
    });

    it('rejects a layout Board Builder books do not have', async () => {
      const file = await bookFile(manifest => manifest.ext_globalsymbols_book.layout = { columns: 4, rows: 4 });

      await expectAsync(obz.parseObz(file)).toBeRejectedWithError(/Board Builder books are 3 columns × 4 rows or 6 columns × 6 rows/);
    });

    it('rejects a book that lists a page the file does not have', async () => {
      const file = await bookFile(manifest => manifest.ext_globalsymbols_book.pages.push('555'));

      await expectAsync(obz.parseObz(file)).toBeRejectedWithError(/page "555" is listed in the book but missing/);
    });

    it('imports an unknown book format version as a board set and says so', async () => {
      const set = await obz.parseObz(await bookFile(manifest => manifest.ext_globalsymbols_book.format = 'book-2.0'));

      expect(set.isBook).toBeFalse();
      expect(set.importNotes[0]).toContain('book-2.0');
    });

    it('skips boards that are neither a page nor the back page, and says how many', async () => {
      const file = await bookFile((manifest, boards) => {
        boards['555'] = { ...boards['100'], id: '555', name: 'Extra' };
        manifest.paths.boards['555'] = 'boards/555.obf';
      });

      const copy = await obz.parseObz(file);
      expect(copy.boards.length).toBe(3);
      expect(copy.importNotes[0]).toContain('1 other board');
    });

    it('reports a manifest that is not JSON', async () => {
      const zip = new JSZip();
      zip.file('manifest.json', '{ not json');

      await expectAsync(obz.parseObz(asFile(await zip.generateAsync({ type: 'blob' })))).toBeRejectedWithError(/invalid JSON/);
    });
  });

  it('uploads embedded tab images like cell images', async () => {
    const copy = new BoardSet().deserialise({ kind: 'book', book_columns: 3, book_rows: 4, boards: [
      { name: 'P', role: 'page', rows: 4, columns: 3, cells: [],
        tab_cell: { caption: 'T', image_url: 'data:image/png;base64,iVBORw0KGgo=' } }
    ] as any });

    await obz.uploadInlineImagesToMedia(copy).toPromise();

    expect((copy.boards[0] as Board).tab_cell.image_url).toBe('https://example.test/uploaded.png');
  });

  it('reads the sample book in the repo (src/testing/fixtures/sample-book.obz)', async () => {
    const blob = await (await fetch('/fixtures/sample-book.obz')).blob();
    const sample = await obz.parseObz(asFile(blob, 'sample-book.obz'));

    expect(sample.isBook).toBeTrue();
    expect(sample.name).toBe('Sample book');
    expect(sample.pages.map(page => page.name)).toEqual(['Animals', 'Food']);
    expect(sample.pages.map(page => page.tab_cell.caption)).toEqual(['Animals', 'Food']);
    expect(sample.pages[1].tab_cell.background_colour).toBe('rgb(237, 125, 49)');
    expect(sample.backPage.back_page_type).toBe('core_words');
  });
});
