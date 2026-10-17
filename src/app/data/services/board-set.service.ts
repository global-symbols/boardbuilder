import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BoardSet} from '@data/models/boardset.model';
import {BackPageType, Board} from '@data/models/board.model';
import {Cell} from '@data/models/cell.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {map} from 'rxjs/operators';
import * as JSZip from 'jszip';
import {ObzManifest} from '@data/models/obz-manifest.interface';
import {Template} from '@data/models/template.model';
import {ObzBook} from '@data/models/obz-manifest.interface';
import {Obf} from '@data/models/obf.interface';
import {BOOK_TAB_WIDTH_RATIO, tabRow} from '@data/models/book-tabs';
import * as mime from 'mime/lite';

// A whole-book PDF generated in the background (Rails BookPdfJob).
export interface BookPdfExport {
  id: number;
  status: 'queued' | 'running' | 'done' | 'failed';
  // Sheets drawn so far, and in total.
  progress?: number;
  total?: number;
  error?: { message?: string, category?: string, overflow?: number } | null;
}

@Injectable({
  providedIn: 'root'
})
export class BoardSetService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/board_sets`;

  constructor(private http: HttpClient) { }

  list(expand = ''): Observable<BoardSet[]> {
    return this.http.get<BoardSet[]>(this.apiEndpoint, { params: { expand } })
      .pipe(map(arr => arr.map(item => new BoardSet().deserialise(item))));
  }

  get(id: number|string, expand = ''): Observable<BoardSet> {
    return this.http.get<BoardSet>(`${this.apiEndpoint}/${id}`, { params: { expand } })
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  add(record: BoardSet): Observable<BoardSet> {
    return this.http.post<BoardSet>(this.apiEndpoint, record)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  update(record: BoardSet): Observable<BoardSet> {
    return this.http.patch<BoardSet>(`${this.apiEndpoint}/${record.id}`, record)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  delete(record: BoardSet): Observable<BoardSet> {
    return this.http.delete<BoardSet>(`${this.apiEndpoint}/${record.id}`);
  }

  // Featured BoardSets
  featured(expand = ''): Observable<BoardSet[]> {
    return this.http.get<BoardSet[]>(`${this.apiEndpoint}/featured`, { params: { expand } })
      .pipe(map(arr => arr.map(item => new BoardSet().deserialise(item))));
  }

  translateLanguages(): Observable<Array<{code: string, name: string}>> {
    return this.http.get<Array<{code: string, name: string}>>(`${this.apiEndpoint}/translate_languages`);
  }

  translate(boardSet: BoardSet, language: string): Observable<BoardSet> {
    return this.http.post<BoardSet>(`${this.apiEndpoint}/${boardSet.id}/translate`, { language })
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  duplicate(boardSet: BoardSet): Observable<BoardSet> {
    return this.http.post<BoardSet>(`${this.apiEndpoint}/${boardSet.id}/duplicate`, {})
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  // Makes a new book from a board set's chosen boards (the board set is not changed).
  convertToBook(boardSet: BoardSet, book: { name: string, book_columns: number, book_rows: number, board_ids: number[] }):
    Observable<BoardSet> {
    return this.http.post<BoardSet>(`${this.apiEndpoint}/${boardSet.id}/convert_to_book`, book)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  // Starts generating the whole book as one PDF, in the background.
  startBookPdfExport(book: BoardSet, template: Template): Observable<BookPdfExport> {
    return this.http.post<BookPdfExport>(`${this.apiEndpoint}/${book.id}/book_pdf_exports`, template);
  }

  bookPdfExport(book: BoardSet, exportId: number): Observable<BookPdfExport> {
    return this.http.get<BookPdfExport>(`${this.apiEndpoint}/${book.id}/book_pdf_exports/${exportId}`);
  }

  // The finished PDF. Rails deletes the export once it has been downloaded.
  downloadBookPdfExport(book: BoardSet, exportId: number): Observable<Blob> {
    return this.http.get(`${this.apiEndpoint}/${book.id}/book_pdf_exports/${exportId}/download`, { responseType: 'blob' });
  }

  // Adds the single back page to a book; an imported back page brings its name and cells.
  addBackPage(boardSet: BoardSet, type: BackPageType, imported?: { name: string, cells: Cell[] }): Observable<Board> {
    return this.http.post<Board>(`${this.apiEndpoint}/${boardSet.id}/back_page`, { type, ...(imported || {}) })
      .pipe(map(data => new Board().deserialise(data)));
  }

  reorderBoards(boardSet: BoardSet, boardIds: number[]): Observable<BoardSet> {
    return this.http.patch<BoardSet>(`${this.apiEndpoint}/${boardSet.id}/reorder_boards`, { board_ids: boardIds })
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  moveToFolder(boardSet: BoardSet, folderId: number | null): Observable<BoardSet> {
    return this.http.patch<BoardSet>(`${this.apiEndpoint}/${boardSet.id}`, { folder_id: folderId || 0 })
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  // Update opened_at date
  touch(record: BoardSet): Observable<BoardSet> {

    record.opened_at = new Date();

    const params = new BoardSet({
      id: record.id,
      opened_at: record.opened_at
    });
    delete params.boards;

    return this.update(params);
  }

  convertToObz(boardSet: BoardSet): Promise<any> {
    return this.writeObz(boardSet.boards, board => board.toObf());
  }

  // A book as an OBZ (book/BOOK-OBZ-FORMAT.md): a normal OBZ of the pages and back page, plus the book settings
  // in ext_globalsymbols_book fields that other apps can ignore.
  convertBookToObz(book: BoardSet): Promise<Blob> {
    const pages = book.pages;
    const backPage = book.backPage;
    const ext: ObzBook = {
      format: 'book-0.1',
      producer: 'Global Symbols Board Builder',
      name: book.name,
      layout: { columns: book.book_columns, rows: book.book_rows },
      pages: pages.map(page => page.id.toString()),
      back_page: backPage ? { id: backPage.id.toString(), type: backPage.back_page_type } : null,
      tabs: { edge: 'right', width_ratio: Math.round(BOOK_TAB_WIDTH_RATIO * 1000) / 1000, placement: 'row_cycle' },
      print: { back_page_after_each_page: true, mirror_back_page: true }
    };

    return this.writeObz([...pages, ...(backPage ? [backPage] : [])], board => this.bookPageObf(book, board), ext);
  }

  // One book page or the back page as OBF, with its book fields. The same JSON is a page's file inside a book OBZ,
  // and on its own it is a single page file (book/BOOK-OBZ-FORMAT.md §6).
  bookPageObf(book: BoardSet, board: Board): Obf {
    const obf = board.toObf();
    if (board.role === 'back_page') {
      obf.ext_globalsymbols_book_page = { role: 'back_page', type: board.back_page_type };
      return obf;
    }
    const pages = book.pages;
    const index = pages.findIndex(page => page.id === board.id);
    obf.ext_globalsymbols_book_page = { role: 'page', number: index + 1, tab_row: tabRow(index, board.rows) + 1 };
    const tab = board.tab_cell;
    if (tab) {
      // Colours as stored (hex or rgb()); the tab's image sits in this board's images like a button's.
      const tabId = `${board.id}-tab`;
      obf.ext_globalsymbols_book_tab = {
        id: tabId,
        label: tab.caption ?? board.name,
        ...(tab.image_url ? { image_id: tabId } : {}),
        ...(tab.background_colour ? { background_color: tab.background_colour } : {}),
        ...(tab.border_colour ? { border_color: tab.border_colour } : {}),
        ...(tab.text_colour ? { text_color: tab.text_colour } : {})
      };
      if (tab.image_url) {
        obf.images.push({ id: tabId, url: tab.image_url, content_type: mime.getType(tab.image_url) });
      }
    }
    return obf;
  }

  // Zips the boards' OBF files with a manifest. The first board is the root.
  private writeObz(boards: Board[], toObf: (board: Board) => Obf, book?: ObzBook): Promise<Blob> {
    const zip = new JSZip();

    // Prepare the bare OBZ Manifest data
    const manifest: ObzManifest = {
      format: 'open-board-0.1',
      root: 'boards/' + boards[0].id + '.obf',
      paths: {
        boards: { },
        images: { },
        sounds: { }
      }
    };
    if (book) { manifest.ext_globalsymbols_book = book; }

    boards.forEach(board => {
      const boardFilename = 'boards/' + board.id + '.obf';

      // Add the Board OBF file to the ZIP file.
      zip.file(boardFilename, JSON.stringify(toObf(board), null, 2));

      // Add the Board OBF file path to the OBZ Manifest
      return manifest.paths.boards[board.id] = boardFilename;
    });

    // Add the OBZ Manifest file to the ZIP.
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    return zip.generateAsync({type: 'blob'});
  }
}
