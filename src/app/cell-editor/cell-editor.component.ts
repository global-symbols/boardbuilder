import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cell} from '../models/cell.model';
import {SymbolSearchDialogComponent} from '../symbol-search-dialog/symbol-search-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.css']
})
export class CellEditorComponent implements OnInit {

  @Input() cell: Cell;
  @Output() cellChange = new EventEmitter<Cell>();

  @Output() close = new EventEmitter<boolean>();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  closeEditor() {
    this.close.emit(true);
  }

  searchSymbols() {
    const dialogRef = this.dialog.open(SymbolSearchDialogComponent, {
      width: '50vw',
      height: '60vh',
      // data: {heading: 'Delete this Board?', content: 'This cannot be undone.'}
    });
  }

}
