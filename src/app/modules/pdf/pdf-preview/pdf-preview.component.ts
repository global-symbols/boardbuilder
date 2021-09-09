import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit {

  constructor(
    private boardService: BoardService,
    private templateService: TemplateService,
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
  compiledPdf = 'about:blank';
  apiError: ApiError;

  pdfEmbedWidth = 1000;
  pdfEmbedHeight = 600;

  showReset = false;

  // @ViewChild('pdfFrame') pdfFrame: ElementRef;
  // @ViewChild('pdfObject') pdfObject: ElementRef;

  ngOnInit() {

    // this.compiledPdf = this.sanitiser.bypassSecurityTrustResourceUrl(null);

    this.boardService.get(this.route.snapshot.paramMap.get('board_id'))
      .subscribe(board => {
        this.board = board;

        this.setTemplateDefaults();
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

    this.boardService.pdf(this.route.snapshot.paramMap.get('board_id'), this.template)
      .then(pdfData => {

        this.compiledPdf = pdfData;

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
    saveAs(this.compiledPdf, `${this.board.name}.pdf`);
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

}
