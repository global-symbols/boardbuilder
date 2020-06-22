import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Cell} from '@data/models/cell.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SymbolSearchPanelComponent} from '../symbol-search-panel/symbol-search-panel.component';
import {moveItemInArray} from '@angular/cdk/drag-drop';

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

  @ViewChild('searchPanel') searchPanel: SymbolSearchPanelComponent;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  closeEditor() {
    this.close.emit(true);
  }

  selectImageUrl(url: string) {
    this.cell.url = url;
  }

  linkToBoardsList(): Array<Board> {
    return this.boardSet.boards.filter(b => b.uuid !== this.board.uuid && b.childBoards().length === 0);
  }

  linkCellToBoard(event: MatSelectChange) {
    const b = event.value;
    console.log('linking to board', b);
    // Add the Board into the Cell.
    this.cell.board = new Board().deserialise(b);

    // Remove the Board from the top-level listing of Boards.
    this.boardSet.deleteBoard(b);
  }

  unlinkCellFromBoard() {
    // Move the linked Board back to the top-level of the BoardSet.
    this.boardSet.boards.push(new Board().deserialise(this.cell.board));

    // Remove the linked Board from this Cell.
    this.cell.board = null;
  }

  // Fires an automatic search when the Search tab is opened.
  // Only fires if the cell has a caption we can search for.
  triggerSearch($event: MatTabChangeEvent) {
    if ($event.index === 1 && this.cell.caption) { this.searchPanel.search(); }
  }

  clearCell(subject: string) {
    if (subject === 'colours') {
      this.cell.backgroundColour = null;
      this.cell.borderColour = null;
      this.cell.textColour = null;
    }

    if (subject === 'symbol') {
      this.cell.url = null;
    }
  }

  moveCell(to: number) {
    moveItemInArray(this.board.cells, this.board.cells.indexOf(this.cell), to);
  }
}
