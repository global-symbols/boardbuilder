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

// How often the page asks how far the book PDF has got.
export const BOOK_EXPORT_POLL_MS = 1000;

// Prints books (D31). Same layout, settings and defaults as the board-set PDF screen.
// - Book mode (/boardsets/:id/book-pdf): the preview is the whole book (each page followed by the back page),
//   generated in the background; the loading notice follows the job page by page.
// - Page mode (/boardsets/:id/book-pdf/:board_id?tabRow=&includeBackPage=): one page (and its back) with the
//   tab row chosen for this print only, generated straight away.
@Component({
  selector: 'app-book-pdf',
  templateUrl: './book-pdf.component.html',
  styleUrls: ['./book-pdf.component.scss']
})
export class BookPdfComponent implements OnInit, OnDestroy {

  book: BoardSet;
  // The chosen page, or page 1 for the whole book (it sets the default orientation and text size).
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

  // Book mode: the background export behind the preview.
  bookExport: BookPdfExport | null = null;
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

  // "page 5 of 12" while the book generates.
  get progressText(): string | null {
    const progress = this.bookExport;
    if (!progress?.total) { return null; }
    return $localize`:book pdf progress|Pages of the book PDF drawn so far:Page ${Math.min(progress.progress + 1, progress.total)}:done: of ${progress.total}:total:`;
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

  private settingsChanged(): void {
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

  // Regenerates the preview: the page straight away, or the whole book through a background export.
  loadPreview(): void {
    this.status = 'loading';
    this.apiError = null;
    this.setEmbedHeight();
    this.revokeCompiledPdfUrl();
    this.stopPolling();
    this.bookExport = null;

    if (this.mode === 'book') {
      this.generateBook();
      return;
    }

    this.boardService.pdfBlob(this.board.id, this.previewTemplate()).then(
      blob => this.showPdf(blob),
      (error: HttpErrorResponse) => {
        this.status = 'error';
        if (error.error instanceof Blob) {
          error.error.text().then(text => {
            try { this.apiError = JSON.parse(text).error; } catch (e) { /* not JSON */ }
          });
        }
      });
  }

  private showPdf(blob: Blob): void {
    this.compiledPdfBlob = blob;
    this.compiledPdfUrl = URL.createObjectURL(blob);
    this.status = 'success';
  }

  setEmbedHeight(): void {
    if (!this.template.pageSize) { return; }
    if (this.template.orientation === 'portrait') {
      this.pdfEmbedHeight = this.pdfEmbedWidth * this.template.pageSize.ratio + 60;
    } else {
      this.pdfEmbedHeight = this.pdfEmbedWidth / this.template.pageSize.ratio + 60;
    }
  }

  downloadPdf(): void {
    if (this.compiledPdfBlob) {
      saveAs(this.compiledPdfBlob, `${this.mode === 'book' ? this.book.name : this.board.name}.pdf`);
    }
  }

  // Starts the whole book in the background (replacing any earlier export) and follows it until it is ready.
  private generateBook(): void {
    this.bookExport = { id: null, status: 'queued', progress: 0, total: 0 };
    this.boardSetService.startBookPdfExport(this.book, this.template).subscribe(
      started => this.watchExport(started),
      () => this.exportFailed());
  }

  private watchExport(started: BookPdfExport): void {
    this.bookExport = started;
    this.poll = timer(0, BOOK_EXPORT_POLL_MS).pipe(
      switchMap(() => this.boardSetService.bookPdfExport(this.book, started.id)),
      takeWhile(state => ['queued', 'running'].includes(state.status), true)
    ).subscribe(state => {
      this.bookExport = state;
      if (state.status === 'done') { this.fetchBook(state.id); }
      if (state.status === 'failed') { this.exportFailed(state.error); }
    }, () => this.exportFailed());
  }

  // The finished file is fetched once (Rails then deletes it) and kept here for the preview and Download.
  private fetchBook(exportId: number): void {
    this.boardSetService.downloadBookPdfExport(this.book, exportId).subscribe(
      blob => this.showPdf(blob),
      () => this.exportFailed());
  }

  private exportFailed(error?: BookPdfExport['error']): void {
    this.stopPolling();
    this.status = 'error';
    // Layout errors look like the single-board ones, so the same "can't fit" help shows.
    this.apiError = (error || { message: 'The book PDF could not be generated' }) as ApiError;
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
