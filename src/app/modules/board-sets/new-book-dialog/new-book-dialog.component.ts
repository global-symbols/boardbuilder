import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Board} from '@data/models/board.model';
import {BookFit, bookFit, hasLinks, suggestedBookLayout} from '@data/models/book-conversion';
import {BOOK_LAYOUTS, BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';

// Convert to book (D40): the board set to make a new book from.
export interface NewBookDialogData {
  source?: BoardSet;
}

interface BookLayoutOption {
  columns: number;
  rows: number;
  cells: number;
}

@Component({
  selector: 'app-new-book-dialog',
  templateUrl: './new-book-dialog.component.html',
  styleUrls: ['./new-book-dialog.component.scss']
})
export class NewBookDialogComponent implements OnInit {

  bookForm: FormGroup;
  saving = false;
  error: string | null = null;

  readonly source: BoardSet | null;
  // Boards with more cells than a page that the user chose to leave out (by board id).
  readonly leftOut = new Set<number>();

  readonly layouts: BookLayoutOption[] = BOOK_LAYOUTS.map(layout => ({ ...layout, cells: layout.columns * layout.rows }));

  constructor(
    public dialogRef: MatDialogRef<NewBookDialogComponent>,
    private service: BoardSetService,
    private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) data: NewBookDialogData | null
  ) {
    this.source = data?.source || null;
  }

  ngOnInit(): void {
    const suggested = this.source ? suggestedBookLayout(this.sourceBoards) : this.layouts[0];
    this.bookForm = this.formBuilder.group({
      name: [this.source?.name || '', [Validators.required, Validators.maxLength(250)]],
      layout: [this.layouts.find(l => l.columns === suggested.columns && l.rows === suggested.rows), Validators.required]
    });
  }

  get converting(): boolean { return !!this.source; }

  // The set's boards in their order (the order pages will have).
  get sourceBoards(): Board[] {
    return (this.source?.boards || []).slice().sort((a, b) => (a.index ?? 0) - (b.index ?? 0) || (a.id ?? 0) - (b.id ?? 0));
  }

  fit(board: Board): BookFit {
    return bookFit(board, this.selectedLayout.columns, this.selectedLayout.rows);
  }

  hasLinks(board: Board): boolean {
    return hasLinks(board);
  }

  toggleLeftOut(board: Board, leaveOut: boolean): void {
    if (leaveOut) { this.leftOut.add(board.id); } else { this.leftOut.delete(board.id); }
  }

  // Boards that will become pages: every board that fits.
  get includedBoards(): Board[] {
    return this.sourceBoards.filter(board => this.fit(board) !== 'too_big');
  }

  // Convert is blocked while a board that does not fit has not been left out.
  get blocked(): boolean {
    return this.sourceBoards.some(board => this.fit(board) === 'too_big' && !this.leftOut.has(board.id));
  }

  get canSubmit(): boolean {
    if (this.bookForm.invalid || this.saving) { return false; }
    return !this.converting || (!this.blocked && this.includedBoards.length > 0);
  }

  get selectedLayout(): BookLayoutOption { return this.bookForm.value.layout; }

  selectLayout(layout: BookLayoutOption): void {
    this.bookForm.patchValue({ layout });
  }

  // Index arrays for the layout preview grid.
  range(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index);
  }

  create(): void {
    if (!this.canSubmit) { return; }
    this.saving = true;
    this.error = null;

    if (this.converting) {
      this.service.convertToBook(this.source, {
        name: this.bookForm.value.name.trim(),
        book_columns: this.selectedLayout.columns,
        book_rows: this.selectedLayout.rows,
        board_ids: this.includedBoards.map(board => board.id)
      }).subscribe(
        created => this.dialogRef.close(created),
        error => {
          this.saving = false;
          this.error = error?.error?.error || $localize`:convert to book failed|Convert to book failed:The book could not be made. Please try again.`;
        });
      return;
    }

    // Rails adds Page 1 (with its tab) to a new book.
    const book = new BoardSet({
      name: this.bookForm.value.name.trim(),
      kind: 'book',
      book_columns: this.selectedLayout.columns,
      book_rows: this.selectedLayout.rows
    });

    this.service.add(book).subscribe(
      created => this.dialogRef.close(created),
      () => this.saving = false
    );
  }
}
