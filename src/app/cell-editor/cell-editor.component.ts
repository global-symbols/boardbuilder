import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cell} from '../models/cell.model';
import {SymbolSearchDialogComponent} from '../symbol-search-dialog/symbol-search-dialog.component';
import {MatDialog, MatSelectChange} from '@angular/material';
import {BoardSet} from '../models/boardset.model';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.css']
})
export class CellEditorComponent implements OnInit {

  @Input() boardSet: BoardSet;
  @Input() board: Board;
  @Input() cell: Cell;
  @Output() cellChange = new EventEmitter<Cell>();
  @Output() boardChange = new EventEmitter<Board>();
  @Output() boardSetChange = new EventEmitter<BoardSet>();

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

  selectImageUrl(url: string) {
    this.cell.url = url;
  }

  linkToBoardsList(): Array<Board> {
    return this.boardSet.boards.filter(b => b.uuid !== this.board.uuid);
  }

  linkCellToBoard(event: MatSelectChange) {
    const b = event.value;
    console.log('linking to board', b);
    // Add the Board into the Cell.
    this.cell.board = new Board().deserialise(b);
    // this.boardSet.forceChangeDetect();

    // Remove the Board from the top-level listing of Boards.
    this.boardSet.deleteBoard(b);
  }

  unlinkCellFromBoard() {
    // Move the linked Board back to the top-level of the BoardSet.
    this.boardSet.boards.push(new Board().deserialise(this.cell.board));

    // Remove the linked Board from this Cell.
    this.cell.board = null;
  }
}
