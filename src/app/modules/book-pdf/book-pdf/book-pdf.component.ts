import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription, timer} from 'rxjs';
import {switchMap, takeWhile} from 'rxjs/operators';
import {saveAs} from 'file-saver';
import {BoardService} from '@data/services/board.service';
import {BoardSetService, BookPdfExport} from '@data/services/board-set.service';
import {TemplateService} from '@data/services/template.service';
import {GlobalSymbolsService} from '@data/services/global-symbols.service';
import {ToolbarService} from '@app/services/toolbar.service';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {Template} from '@data/models/template.model';
import {PageSize} from '@data/models/page-size.model';
import {ApiError} from '@data/interfaces/api-error.interface';
import {Symbolset} from '@data/models/symbolset';

// How often the page asks whether a book PDF has finished.
export const BOOK_EXPORT_POLL_MS = 2000;

// Prints books (D31). Same settings and defaults as the board-set PDF screen.
// - Book mode (/boardsets/:id/book-pdf): previews page 1; Generate PDF builds the whole book in the background,
//   then offers a download link.
// - Page mode (/boardsets/:id/book-pdf/:board_id?tabRow=&includeBackPage=): previews one page (and its back)
//   with the tab row chosen for this print only, and downloads it.
@Component({
  selector: 'app-book-pdf',
  templateUrl: './book-pdf.component.html',
  styleUrls: ['./book-pdf.component.scss']
})
export class BookPdfComponent implements OnInit, OnDestroy {

  book: BoardSet;
  // The page previewed: the chosen page, or page 1 for the whole book.
  board: Board;
  mode: 'book' | 'page';
  tabRow: number | null = null;
  includeBackPage = false;

  template = new Template();
  pageSizes: PageSize[];
  readonly fontSizes = Array.from(Array(108).keys());
  // 0, 5, 10, 15 ... 50
  readonly cellSpacingValues = Array.from(Array(51).keys()).filter(v => v % 5 === 0);
  showReset = false;

  status: 'loading' | 'success' | 'error' = 'loading';
  apiError: ApiError;
  compiledPdfUrl = 'about:blank';
  private compiledPdfBlob: Blob | null = null;
  pdfEmbedWidth = 1000;
  pdfEmbedHeight = 600;

  // Whole-book export (book mode).
  bookExport: BookPdfExport | null = null;
  exportError: string | null = null;
  downloading = false;
  private poll: Subscription;

  symbolsets: Symbolset[] = [];
  symbolsetInfo: Array<{symbolset: Symbolset, count: number}> = [];

  constructor(
    private boardService: BoardService,
    private boardSetService: BoardSetService,
    private templateService: TemplateService,
    private globalSymbolsService: GlobalSymbolsService,
    private route: ActivatedRoute,
    private router: Router,
    private toolbarService: ToolbarService
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    const query = this.route.snapshot.queryParamMap;
    this.mode = params.get('board_id') ? 'page' : 'book';
    this.tabRow = query.get('tabRow') ? Number(query.get('tabRow')) : null;
    this.includeBackPage = query.get('includeBackPage') === 'true';

    this.toolbarService.setButtons([{
      text: 'Book',
      icon: 'arrow_back',
      action: () => this.returnToBook()
    }]);

    this.boardSetService.get(params.get('id'), 'boards boards.cells boards.cells.picto').subscribe(book => {
      this.book = book;
      const boardId = Number(params.get('board_id'));
      this.board = this.mode === 'page' ? book.boards.find(board => board.id === boardId) : book.pages[0];
      this.loadSymbolsets();
      this.setTemplateDefaults();
    });
  }

  get generating(): boolean {
    return !!this.bookExport && ['queued', 'running'].includes(this.bookExport.status);
  }

  get bookReady(): boolean {
    return this.bookExport?.status === 'done';
  }

  get hasPictos(): boolean {
    return this.cellsForLicence.some(cell => cell.picto);
  }

  // The same defaults as the board-set PDF screen.
  setTemplateDefaults(): void {
    this.showReset = false;
    this.template.orientation = (this.board.rows > this.board.logicalColumns) ? 'portrait' : 'landscape';

    this.templateService.pageSizes().subscribe(sizes => {
      this.pageSizes = sizes;
      this.template.pageSize = sizes.find(s => s.name === 'A4');

      this.template.fontSize = Math.round((this.template.pageSize.y / this.board.rows) * 0.1);
      this.template.cellPadding = 10;
      this.template.cellSpacing = 10;
      this.template.drawCellBorders = true;
      this.template.cellBorderWidth = 1;
      this.template.showHeader = false;
      this.template.imageTextSpacing = -1;

      this.settingsChanged();
    });
  }

  onSettingChanged(): void {
    this.showReset = true;
    this.settingsChanged();
  }

  // New settings: refresh the preview and drop any whole-book PDF made with the old ones.
  private settingsChanged(): void {
    this.stopPolling();
    this.bookExport = null;
    this.exportError = null;
    this.loadPreview();
  }

  // What the preview and the page download send: the template plus, in page mode, this print's tab choices.
  previewTemplate(): Template {
    const template = new Template().deserialise({ ...this.template });
    if (this.mode === 'page') {
      if (this.tabRow) { template.tabRow = this.tabRow; }
      template.includeBackPage = this.includeBackPage;
    }
    return template;
  }

  loadPreview(): void {
    this.status = 'loading';
    this.apiError = null;
    this.setEmbedHeight();
    this.revokeCompiledPdfUrl();

    this.boardService.pdfBlob(this.board.id, this.previewTemplate()).then(blob => {
      this.compiledPdfBlob = blob;
      this.compiledPdfUrl = URL.createObjectURL(blob);
      this.status = 'success';
    }, (error: HttpErrorResponse) => {
      this.status = 'error';
      if (error.error instanceof Blob) {
        error.error.text().then(text => {
          try { this.apiError = JSON.parse(text).error; } catch (e) { /* not JSON */ }
        });
      }
    });
  }

  setEmbedHeight(): void {
    if (!this.template.pageSize) { return; }
    if (this.template.orientation === 'portrait') {
      this.pdfEmbedHeight = this.pdfEmbedWidth * this.template.pageSize.ratio + 60;
    } else {
      this.pdfEmbedHeight = this.pdfEmbedWidth / this.template.pageSize.ratio + 60;
    }
  }

  // Page mode: download what the preview shows.
  downloadPage(): void {
    if (this.compiledPdfBlob) {
      saveAs(this.compiledPdfBlob, `${this.board.name}.pdf`);
    }
  }

  // Book mode: start the whole book in the background and poll until it is ready.
  generateBook(): void {
    if (this.generating) { return; }
    this.exportError = null;
    this.bookExport = { id: null, status: 'queued' };

    this.boardSetService.startBookPdfExport(this.book, this.template).subscribe(started => {
      this.bookExport = started;
      this.watchExport(started.id);
    }, () => this.exportFailed());
  }

  private watchExport(exportId: number): void {
    this.stopPolling();
    if (!this.generating) { return this.showExportOutcome(); }

    this.poll = timer(BOOK_EXPORT_POLL_MS, BOOK_EXPORT_POLL_MS).pipe(
      switchMap(() => this.boardSetService.bookPdfExport(this.book, exportId)),
      takeWhile(state => ['queued', 'running'].includes(state.status), true)
    ).subscribe(state => {
      this.bookExport = state;
      this.showExportOutcome();
    }, () => this.exportFailed());
  }

  private showExportOutcome(): void {
    if (this.bookExport?.status !== 'failed') { return; }
    const error = this.bookExport.error;
    this.exportError = error?.category === 'insufficient_cell_height'
      ? $localize`:book pdf fit error|Book PDF could not fit the layout:We can't fit everything on the page with these settings. Try smaller spacing, padding or text, or a larger paper size.`
      : $localize`:book pdf failed|Book PDF generation failed:The book PDF could not be generated. Please try again.`;
  }

  private exportFailed(): void {
    this.stopPolling();
    this.bookExport = { id: this.bookExport?.id, status: 'failed' };
    this.showExportOutcome();
  }

  // The file can be downloaded once: Rails deletes it afterwards, so the link goes too.
  downloadBook(): void {
    if (!this.bookReady || this.downloading) { return; }
    this.downloading = true;
    this.boardSetService.downloadBookPdfExport(this.book, this.bookExport.id).subscribe(blob => {
      saveAs(blob, `${this.book.name}.pdf`);
      this.bookExport = null;
      this.downloading = false;
    }, () => {
      this.downloading = false;
      this.exportFailed();
    });
  }

  returnToBook(): void {
    this.router.navigate(['/', 'boardsets', this.route.snapshot.paramMap.get('id')]);
  }

  // Licence notice covers the symbols being printed: the page (and back), or the whole book.
  private get cellsForLicence() {
    if (!this.book || !this.board) { return []; }
    const boards = this.mode === 'book' ? this.book.boards
      : [this.board, ...(this.includeBackPage && this.book.backPage ? [this.book.backPage] : [])];
    return [].concat(...boards.map(board => board.cells || []));
  }

  private loadSymbolsets(): void {
    this.globalSymbolsService.getSymbolSets().subscribe(symbolsets => {
      this.symbolsets = symbolsets;
      const counts = new Map<number, number>();
      this.cellsForLicence.filter(cell => cell.picto?.symbolset_id).forEach(cell => {
        counts.set(cell.picto.symbolset_id, (counts.get(cell.picto.symbolset_id) || 0) + 1);
      });
      this.symbolsetInfo = Array.from(counts.entries())
        .map(([id, count]) => ({ symbolset: symbolsets.find(s => s.id === id), count }))
        .filter(info => info.symbolset)
        .sort((a, b) => a.symbolset.name.localeCompare(b.symbolset.name));
    }, () => this.symbolsetInfo = []);
  }

  private stopPolling(): void {
    if (this.poll) { this.poll.unsubscribe(); this.poll = undefined; }
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.revokeCompiledPdfUrl();
  }

  private revokeCompiledPdfUrl(): void {
    if (this.compiledPdfUrl && this.compiledPdfUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.compiledPdfUrl);
    }
    this.compiledPdfUrl = 'about:blank';
    this.compiledPdfBlob = null;
  }
}
