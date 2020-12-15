import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardService} from '@data/services/board.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {ToolbarService} from '@app/services/toolbar.service';
import {Board} from '@data/models/board.model';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss']
})
export class PdfPreviewComponent implements OnInit {

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private hotkeysService: HotkeysService,
    private toolbarService: ToolbarService
  ) {
    // Keyboard shortcut - delete Board
    this.hotkeysService.add(new Hotkey('escape', () => {
      this.returnToBoard();
      return false; // Prevent bubbling
    }));
  }

  status: 'loading' | 'success' | 'error' = 'loading';

  board: Board;
  compiledPdf;
  failureReason: string;

  @ViewChild('pdfFrame') pdfFrame: ElementRef;

  ngOnInit() {
    this.boardService.pdf(this.route.snapshot.paramMap.get('board_id'))
      .then(pdfData => {
        this.compiledPdf = pdfData;
        this.pdfFrame.nativeElement.src = this.compiledPdf;
        this.status = 'success';
      }, error => {
        this.failureReason = error;
        return this.status = 'error';
      });

    this.toolbarService.setButtons([{
      text: 'Board Set',
      icon: 'arrow_back',
      action: () => this.router.navigate(['/', 'boardsets', this.route.snapshot.paramMap.get('id')])
    }]);

    this.boardService.get(this.route.snapshot.paramMap.get('board_id'))
      .subscribe(board => this.board = board);
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
