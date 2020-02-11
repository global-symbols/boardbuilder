import {Component, Inject, OnInit, SecurityContext} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Board} from '../models/board.model';
import * as jsPDF from 'jspdf';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.css']
})
export class PdfDialogComponent implements OnInit {

  board: Board;
  pdf;
  pdfOutput;

  constructor(@Inject(MAT_DIALOG_DATA) board: Board, private sanitiser: DomSanitizer) {
    const orientation = (board.rows > board.columns) ? 'portrait' : 'landscape';
    this.pdf = new jsPDF({orientation});
    this.board = board;
  }

  ngOnInit(): void {
    // this.pdf.text('Hello world!', 10, 10);
    this.pdf.table(1, 1, [1, 2, 3], null, { autoSize: true });

    this.pdfOutput = this.sanitiser.sanitize(
      SecurityContext.NONE, this.sanitiser.bypassSecurityTrustResourceUrl(this.pdf.output('datauristring'))
    );
    // this.pdf.save('test.pdf');
  }

}
