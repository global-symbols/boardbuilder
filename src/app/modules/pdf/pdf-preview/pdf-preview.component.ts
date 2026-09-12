import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BoardService} from '@data/services/board.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Hotkey, HotkeysService} from '@conflito/angular2-hotkeys';
import {ToolbarService} from '@app/services/toolbar.service';
import {Board} from '@data/models/board.model';
import {saveAs} from 'file-saver';
import {TemplateService} from '@data/services/template.service';
import {PageSize} from '@data/models/page-size.model';
import {Template} from '@data/models/template.model';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '@data/interfaces/api-error.interface';
import {GlobalSymbolsService} from '@data/services/global-symbols.service';
import {Symbolset} from '@data/models/symbolset';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit, OnDestroy {

  constructor(
    private boardService: BoardService,
    private templateService: TemplateService,
    private globalSymbolsService: GlobalSymbolsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sanitiser: DomSanitizer,
    private hotkeysService: HotkeysService,
    private toolbarService: ToolbarService
  ) {
    // Keyboard shortcut - delete Board
    this.hotkeysService.add(new Hotkey('escape', () => {
      this.returnToBoard();
      return false; // Prevent bubbling
    }));

    this.template = new Template();

    this.fontSizes = Array.from(Array(108).keys());
    // 0, 5, 10, 15 ... 50
    this.cellSpacingValues = Array.from(Array(51).keys()).filter(v => v % 5 === 0);
  }

  status: 'loading' | 'success' | 'error' = 'loading';

  pageSizes: PageSize[];
  fontSizes: Array<number>;
  cellSpacingValues: Array<number>;

  template: Template;

  board: Board;
  compiledPdfUrl = 'about:blank';
  private compiledPdfBlob: Blob | null = null;
  apiError: ApiError;

  pdfEmbedWidth = 1000;
  pdfEmbedHeight = 600;

  showReset = false;

  symbolsets: Symbolset[] = [];
  symbolsetInfo: Array<{symbolset: Symbolset, count: number}> = [];

  get boardHasPictos(): boolean {
    return this.board && this.board.cells && this.board.cells.some(cell => cell.picto);
  }

  // @ViewChild('pdfFrame') pdfFrame: ElementRef;
  // @ViewChild('pdfObject') pdfObject: ElementRef;

  ngOnInit() {
    // Request board data with expansion to include picto/symbol information
    this.boardService.get(this.route.snapshot.paramMap.get('board_id'), 'cells cells.picto')
      .subscribe({
        next: (board) => {
          this.board = board;
          this.loadSymbolsets();
          this.setTemplateDefaults();
        },
        error: (error) => {
          console.error('Failed to load board:', error);
        }
      });

    this.toolbarService.setButtons([{
      text: 'Board Set',
      icon: 'arrow_back',
      action: () => this.router.navigate(['/', 'boardsets', this.route.snapshot.paramMap.get('id')])
    }]);
  }

  // Configures some default template settings.
  // Run this after populating this.board.
  setTemplateDefaults() {
    this.showReset = false;
    this.template.orientation = (this.board.rows > this.board.logicalColumns) ? 'portrait' : 'landscape';

    this.templateService.pageSizes().subscribe(
      sizes => {
        this.pageSizes = sizes;
        this.template.pageSize = sizes.find(s => s.name === 'A4');

        this.template.fontSize = Math.round((this.template.pageSize.y / this.board.rows) * 0.1);
        this.template.cellPadding = 10;
        this.template.cellSpacing = 10;
        this.template.drawCellBorders = true;
        this.template.cellBorderWidth = 1;
        this.template.showHeader = false;
        this.template.imageTextSpacing = -1;

        this.loadPdf();
      }
    );
  }

  onSettingChanged() {
    this.showReset = true;
    this.loadPdf();
  }

  loadPdf() {
    this.status = 'loading';
    this.apiError = null;

    this.setEmbedHeight();

    // Revoke any previous object URL before generating a new one.
    this.revokeCompiledPdfUrl();

    this.boardService.pdfBlob(this.route.snapshot.paramMap.get('board_id'), this.template)
      .then(blob => {
        this.compiledPdfBlob = blob;
        this.compiledPdfUrl = URL.createObjectURL(blob);

        // const clone = this.pdfFrame.nativeElement.cloneNode(true);
        // clone.setAttribute('src', this.compiledPdf);
        // this.pdfFrame.nativeElement = clone;

        // this.pdfFrame.nativeElement.removeAttribute('src');
        // setTimeout(() => this.pdfFrame.nativeElement.src = this.compiledPdf);
        this.status = 'success';

      }, (error: HttpErrorResponse) => {
        error.error.text().then(text => {
          this.apiError = JSON.parse(text).error;
        });
        return this.status = 'error';
      });
  }

  setEmbedHeight(): void {
    // Set the height of the PDF Embed container so it fits the paper size
    if (this.template.orientation === 'portrait') {
      this.pdfEmbedHeight = this.pdfEmbedWidth * this.template.pageSize.ratio + 60;
    } else {
      this.pdfEmbedHeight = this.pdfEmbedWidth / this.template.pageSize.ratio + 60;
    }

  }

  downloadPdf() {
    if (this.compiledPdfBlob) {
      saveAs(this.compiledPdfBlob, `${this.board.name}.pdf`);
    } else if (this.compiledPdfUrl) {
      // Fallback: file-saver can also accept a URL string in some cases.
      saveAs(this.compiledPdfUrl, `${this.board.name}.pdf`);
    }
  }

  loadSymbolsets() {
    this.globalSymbolsService.getSymbolSets().subscribe({
      next: (symbolsets) => {
        this.symbolsets = symbolsets;
        this.processSymbolsetInfo();
      },
      error: (error) => {
        console.error('Failed to load symbolsets:', error);
      }
    });
  }

  processSymbolsetInfo() {
    if (!this.board || !this.symbolsets.length) {
      return;
    }

    // Filter cells with pictos
    const cellsWithPictos = this.board.cells.filter(cell => cell.picto);

    if (cellsWithPictos.length === 0) {
      this.symbolsetInfo = [];
      return;
    }

    // Extract and validate pictos
    const pictos = cellsWithPictos.map(cell => cell.picto);
    const validPictos = pictos.filter(picto => picto && picto.symbolset_id);

    if (validPictos.length === 0) {
      this.symbolsetInfo = [];
      return;
    }

    // Group by symbolset_id
    const symbolsetCounts = new Map<number, number>();
    validPictos.forEach(picto => {
      const count = symbolsetCounts.get(picto.symbolset_id) || 0;
      symbolsetCounts.set(picto.symbolset_id, count + 1);
    });

    // Match with symbolset metadata
    const rawSymbolsetInfo = Array.from(symbolsetCounts.entries())
      .map(([symbolsetId, count]) => {
        const symbolset = this.symbolsets.find(s => s.id === symbolsetId);
        return symbolset ? { symbolset, count } : null;
      })
      .filter(info => info !== null);

    // Sort and store
    this.symbolsetInfo = rawSymbolsetInfo.sort((a, b) => a.symbolset.name.localeCompare(b.symbolset.name));
  }

  returnToBoard() {
    if (this.board) {
      this.router.navigate(['/', 'boardsets', this.board.board_set_id], {
        queryParams: {board: this.board.id}
      }).then();
    } else {
      this.location.back();
    }
  }

  ngOnDestroy(): void {
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
