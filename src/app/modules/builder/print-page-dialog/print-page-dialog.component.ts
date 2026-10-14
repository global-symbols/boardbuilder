import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {tabRow} from '@data/models/book-tabs';

export interface PrintPageDialogData {
  book: BoardSet;
  page: Board;
}

// What to print, for this print only (nothing is saved): 1-based tab row and whether the back page follows.
export interface PrintPageChoice {
  tabRow: number;
  includeBackPage: boolean;
}

@Component({
  selector: 'app-print-page-dialog',
  templateUrl: './print-page-dialog.component.html',
  styleUrls: ['./print-page-dialog.component.scss']
})
export class PrintPageDialogComponent {

  readonly bookRow: number;
  readonly rows: number[];
  readonly hasBackPage: boolean;

  selectedRow: number;
  includeBackPage = true;

  constructor(
    public dialogRef: MatDialogRef<PrintPageDialogComponent, PrintPageChoice>,
    @Inject(MAT_DIALOG_DATA) public data: PrintPageDialogData
  ) {
    const pageIndex = data.book.pages.findIndex(page => page.id === data.page.id);
    this.bookRow = tabRow(pageIndex, data.page.rows) + 1;
    this.rows = Array.from({ length: data.page.rows }, (_, index) => index + 1);
    this.hasBackPage = !!data.book.backPage;
    this.selectedRow = this.bookRow;
  }

  // Sketch cells for the chosen layout.
  get cells(): number[] {
    return Array.from({ length: this.data.page.rows * this.data.page.columns }, (_, index) => index);
  }

  continue(): void {
    this.dialogRef.close({
      tabRow: this.selectedRow,
      includeBackPage: this.hasBackPage && this.includeBackPage
    });
  }
}
