import {Injectable} from '@angular/core';
import {Board} from '@data/models/board.model';
import * as JSZip from 'jszip';
import {BoardSet} from '@data/models/boardset.model';
import {MediaService} from '@data/services/media.service';
import {Observable, from, of, forkJoin} from 'rxjs';
import {switchMap, map} from 'rxjs/operators';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardService} from '@data/services/board.service';
import {Obf} from '@data/models/obf.interface';
import {$localize} from '@angular/localize/init';
import {BOOK_LAYOUTS} from '@data/models/boardset.model';
import {ObzBook} from '@data/models/obz-manifest.interface';
import {Cell} from '@data/models/cell.model';

// One board read from an OBZ, with its manifest id and raw OBF (for book fields).
interface ObzBoardItem {
  obfId: string;
  obf: Obf;
  board: Board;
}

interface UploadedImageMap {
  originalId: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ObfObzService {

  constructor(private mediaService: MediaService,
              private boardSetService: BoardSetService,
              private boardService: BoardService) { }

  // Resolves OBF images that use path (files inside OBZ) by reading from zip and setting url as data URL.
  private resolveObzImages(zip: JSZip, obf: any): Promise<any> {
    if (!obf.images || !Array.isArray(obf.images)) { return Promise.resolve(obf); }
    const promises = obf.images
      .filter((img: any) => img && img.path)
      .map((img: any) => {
        const path = img.path;
        if (!zip.file(path)) {
          return Promise.reject(new Error($localize`:obz upload error file missing:${path} is missing.`));
        }
        return zip.file(path).async('base64').then(base64 => {
          const contentType = img.content_type || 'image/png';
          img.url = `data:${contentType};base64,${base64}`;
          delete img.path;
        });
      });
    return Promise.all(promises).then(() => obf);
  }

  // Parses an OBF object to a Board. Does not upload embedded images.
  public parseObf(obf: Obf, boardSet?: BoardSet): Board {
    const board = new Board();
    board.fromObf(obf);
    if (boardSet) { board.board_set_id = boardSet.id; }
    return board;
  }

  // Parses an OBZ file to a BoardSet containing Boards. Does not upload embedded images.
  public parseObz(file): Promise<BoardSet> {
    const boardSet = new BoardSet();
    boardSet.boards = [];

    // Try to open the zip file
    return JSZip.loadAsync(file).then(zip => {

      // Check the manifest file exists
      if (!zip.file('manifest.json')) {
        throw new Error($localize`:obz upload error no manifest:it does not contain a manifest.json file.`);
      }

      // Try to open the manifest file
      return zip.file('manifest.json').async('string').then(data => {
        let manifest: any;
        
        if (!data || data.length === 0) {
          throw new Error($localize`:obz upload error bad manifest:the manifest.json file is empty.`);
        }
        
        try {
          manifest = JSON.parse(data);
        } catch (parseError: any) {
          console.error('JSON parse error:', parseError, 'Data:', data.substring(0, 200));
          const parseErrorMessage = parseError.message || String(parseError);
          const baseMessage = $localize`:obz upload error bad manifest:the manifest.json file contains invalid JSON.`;
          throw new Error(baseMessage + ' ' + parseErrorMessage);
        }

        // Create a new BoardSet using the OBZ filename as the title
        boardSet.title = file.name;

        // Validate manifest structure with detailed error messages
        if (!manifest) {
          throw new Error($localize`:obz upload error bad manifest:the manifest.json file is invalid or empty.`);
        }
        
        // Support both formats:
        // 1. New format with paths.boards object
        // 2. Legacy format with single root board file
        let boardPromises: Promise<ObzBoardItem>[];
        
        if (manifest.paths && manifest.paths.boards) {
          // New format: paths.boards object
          if (typeof manifest.paths.boards !== 'object' || Array.isArray(manifest.paths.boards)) {
            console.error('Manifest paths.boards structure:', manifest.paths.boards);
            throw new Error($localize`:obz upload error bad manifest:the manifest.json file 'paths.boards' property must be an object, not an array.`);
          }
          
          if (Object.keys(manifest.paths.boards).length === 0) {
            throw new Error($localize`:obz upload error bad manifest:the manifest.json file 'paths.boards' object is empty.`);
          }

          // From the manifest, get the path of each OBF file.
          // The list of OBF files is stored as an object {}, so we have to use Object.entries
          boardPromises = Object.entries(manifest.paths.boards).map((board) => {

            // The key is the ID of the OBF, used for referencing when linking Boards.
            const obfId = board[0];
            // The value is the OBF path and filename within the zip file.
            const obfFilename = board[1].toString();

            // Check the OBF file exists within the zip.
            if (!zip.file(obfFilename)) {
              throw new Error($localize`:obz upload error file missing:${obfFilename} is missing.`);
            }

            // Access the OBF file, resolve path-based images from zip, then unpack to a Board.
            return zip.file(obfFilename).async('binarystring')
              .then(obfStr => JSON.parse(obfStr))
              .then(obf => this.resolveObzImages(zip, obf))
              .then(obf => ({ obfId, obf, board: this.parseObf(obf) }));
          });
        } else if (manifest.root) {
          // Legacy format: single root board file
          const rootFilename = manifest.root.toString();
          
          // Check the root OBF file exists within the zip.
          if (!zip.file(rootFilename)) {
            throw new Error($localize`:obz upload error file missing:${rootFilename} is missing.`);
          }

          // Access the root OBF file, resolve path-based images from zip, then unpack to a Board.
          boardPromises = [
            zip.file(rootFilename).async('binarystring')
              .then(obfStr => JSON.parse(obfStr))
              .then(obf => this.resolveObzImages(zip, obf))
              .then(obf => ({ obfId: String(obf.id), obf, board: this.parseObf(obf) }))
          ];
        } else {
          // Neither format found
          const manifestKeys = Object.keys(manifest).join(', ');
          console.error('Manifest structure:', JSON.stringify(manifest, null, 2));
          const baseMessage = $localize`:obz upload error bad manifest:the manifest.json file does not contain a 'paths' property or 'root' property.`;
          const detailMessage = manifestKeys ? ` Found properties: ${manifestKeys}` : ' No properties found.';
          throw new Error(baseMessage + detailMessage);
        }

        // Wait for all boards to be parsed before returning. A book manifest makes it a new book.
        return Promise.all(boardPromises).then(items => {
          boardSet.boards = items.map(item => item.board);
          return manifest.ext_globalsymbols_book ? this.toBook(boardSet, manifest.ext_globalsymbols_book, items) : boardSet;
        });

      }).catch(error => {
        console.error('Error reading manifest.json:', error);
        // Preserve the original error message if it's already a meaningful error
        if (error.message && error.message.includes('obz upload error') || error.bookError) {
          throw error;
        }
        // Otherwise, provide a more informative error message
        const errorMessage = error.message || String(error);
        const baseMessage = $localize`:obz upload error bad manifest:the manifest.json file could not be read.`;
        throw new Error(baseMessage + ' ' + errorMessage);
      });

    }).catch(error => {
      if (error.message && error.message.includes('manifest') || error.bookError) {
        throw error;
      }
      throw new Error($localize`:obz upload error corrupt zip:it is corrupted (could not read ZIP).`);
    });
  }

  // Turns the boards of an OBZ with ext_globalsymbols_book into a new book (book/BOOK-OBZ-FORMAT.md §4):
  // pages in the manifest's order, the back page with its type, and each page's tab. An unknown major
  // version falls back to a board set; a wrong layout or missing page stops the import with a message.
  private toBook(boardSet: BoardSet, book: ObzBook, items: ObzBoardItem[]): BoardSet {
    if (!/^book-0\./.test(book.format || '')) {
      boardSet.importNotes = [$localize`:obz book unknown version|Book OBZ in a format version this app does not know:This file uses book format "${book.format}:format:", which this version of Board Builder does not know, so it will be added as a board set.`];
      return boardSet;
    }

    const columns = book.layout?.columns;
    const rows = book.layout?.rows;
    if (!BOOK_LAYOUTS.some(layout => layout.columns === columns && layout.rows === rows)) {
      throw bookError($localize`:obz book bad layout|Book OBZ layout is not supported:the book is ${columns}:columns: columns × ${rows}:rows: rows; Board Builder books are 3 columns × 4 rows or 6 columns × 6 rows.`);
    }

    const find = (id: string): ObzBoardItem | undefined =>
      items.find(item => item.obfId === String(id)) || items.find(item => String(item.obf.id) === String(id));
    const pages = (book.pages || []).map(id => {
      const item = find(id);
      if (!item) {
        throw bookError($localize`:obz book missing page|A page listed in the book OBZ is missing:page "${id}:id:" is listed in the book but missing from the file.`);
      }
      return item;
    });
    if (pages.length === 0) {
      throw bookError($localize`:obz book no pages|Book OBZ lists no pages:the book has no pages.`);
    }

    let back: ObzBoardItem | undefined;
    if (book.back_page) {
      back = find(book.back_page.id);
      if (!back) {
        throw bookError($localize`:obz book missing back page|The back page listed in the book OBZ is missing:the back page "${book.back_page.id}:id:" is missing from the file.`);
      }
      if (!['core_words', 'conversation_support'].includes(book.back_page.type)) {
        throw bookError($localize`:obz book bad back page type|Back page type in the book OBZ is not supported:the back page type "${book.back_page.type}:type:" is not Core Words or Conversation Support.`);
      }
    }

    const used = [...pages, ...(back ? [back] : [])];
    used.forEach(({ board }) => {
      if (board.columns !== columns || board.rows !== rows) {
        throw bookError($localize`:obz book board size|A board in the book OBZ has a different size from the book:"${board.name}:name:" is ${board.columns}:boardColumns: columns × ${board.rows}:boardRows: rows; this book is ${columns}:columns: columns × ${rows}:rows: rows.`);
      }
    });

    pages.forEach(item => {
      item.board.role = 'page';
      item.board.tab_cell = this.tabCell(item);
    });
    if (back) {
      back.board.role = 'back_page';
      back.board.back_page_type = book.back_page.type;
    }

    const imported = new BoardSet({
      name: book.name || boardSet.name,
      kind: 'book',
      book_columns: columns,
      book_rows: rows,
      boards: used.map(item => item.board)
    });
    const skipped = items.length - new Set(used).size;
    if (skipped > 0) {
      imported.importNotes = [$localize`:obz book skipped boards|Boards in a book OBZ that are not part of the book:${skipped}:count: other board(s) in the file are not part of the book and will be skipped.`];
    }
    return imported;
  }

  // A page's tab from ext_globalsymbols_book_tab. Without one, Rails labels the tab with the page name.
  private tabCell(item: ObzBoardItem): Cell | undefined {
    const tab = item.obf.ext_globalsymbols_book_tab;
    if (!tab) { return undefined; }
    const image = tab.image_id ? (item.obf.images || []).find(img => img.id === tab.image_id) : undefined;
    return new Cell({
      caption: tab.label,
      image_url: image?.url,
      background_colour: tab.background_color,
      border_colour: tab.border_color,
      text_colour: tab.text_color
    });
  }

  /**
   * Uploads cells' inline images (data URLs) to the media API and replaces image_url with public_url
   * so the backend does not receive oversized data. Call before adding a board set that came from OBZ.
   */
  public uploadInlineImagesToMedia(boardSet: BoardSet): Observable<BoardSet> {
    const cellsWithDataUrl: { cell: any; dataUrl: string }[] = [];
    (boardSet.boards || []).forEach(board => {
      [...(board.cells || []), ...(board.tab_cell ? [board.tab_cell] : [])].forEach(cell => {
        const url = cell.image_url || cell.imageData;
        if (url && typeof url === 'string' && url.startsWith('data:')) {
          cellsWithDataUrl.push({ cell, dataUrl: url });
        }
      });
    });
    if (cellsWithDataUrl.length === 0) {
      return of(boardSet);
    }
    const dataURLtoBlob = (dataUrl: string): Blob => {
      const arr = dataUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/png';
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8 = new Uint8Array(n);
      for (let i = 0; i < n; i++) { u8[i] = bstr.charCodeAt(i); }
      return new Blob([u8], { type: mime });
    };
    const uploads = cellsWithDataUrl.map(({ cell, dataUrl }) =>
      this.mediaService.add(dataURLtoBlob(dataUrl), null).pipe(
        map(media => {
          cell.image_url = media.public_url;
          cell.media_id = media.id;
          cell.media = media;
          return media;
        })
      )
    );
    return forkJoin(uploads).pipe(map(() => boardSet));
  }

  // Uploads a BoardSet from an OBZ file, including embedded images.
  public uploadObz(file): Observable<BoardSet> {
    return from(this.parseObz(file)).pipe(
      switchMap(boardSet => this.uploadInlineImagesToMedia(boardSet)),
      switchMap(boardSet => this.boardSetService.add(boardSet))
    );
  }
}

// Book import problems keep their own message (they name the board and its size).
function bookError(message: string): Error {
  const error = new Error(message);
  (error as any).bookError = true;
  return error;
}
