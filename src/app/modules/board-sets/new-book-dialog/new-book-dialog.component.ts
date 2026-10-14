import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {BOOK_LAYOUTS, BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';

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

  readonly layouts: BookLayoutOption[] = BOOK_LAYOUTS.map(layout => ({ ...layout, cells: layout.columns * layout.rows }));

  constructor(
    public dialogRef: MatDialogRef<NewBookDialogComponent>,
    private service: BoardSetService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(250)]],
      layout: [this.layouts[0], Validators.required]
    });
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
    if (this.bookForm.invalid || this.saving) { return; }
    this.saving = true;

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
