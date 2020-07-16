import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Cell} from '@data/models/cell.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {CellEditorSearchPanelComponent} from '@modules/builder/cell-editor-search-panel/cell-editor-search-panel.component';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() boardSet: BoardSet;
  @Input() board: Board;
  @Input() cell: Cell;

  @Output() closed = new EventEmitter<boolean>();

  @ViewChild('searchPanel') searchPanel: CellEditorSearchPanelComponent;

  constructor(public dialog: MatDialog, private cellService: CellService, private boardService: BoardService) { }

  ngOnInit() {
  }

  // Save the Cell to the API when the component is destroyed
  ngOnDestroy() {
    if (this.cell) {
      this.cellService.update(this.cell).subscribe();
    }
  }

  // Save the Cell to the API when the selected cell is changed, either by selecting another Cell or closing the CellEditor...
  ngOnChanges(changes: SimpleChanges) {
    if (changes.cell?.previousValue) {
      this.cellService.update(changes.cell.previousValue).subscribe();
    }
  }

  closeEditor() {
    this.closed.emit(true);
  }

  selectImageUrl(url: string) {
    this.cell.image_url = url;
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
      this.cell.background_colour = null;
      this.cell.border_colour = null;
      this.cell.text_colour = null;
    }

    if (subject === 'symbol') {
      this.cell.image_url = null;
    }
  }

  moveCell(to: number) {
    moveItemInArray(this.board.cells, this.board.cells.indexOf(this.cell), to);
    // TODO: Debounce for chained cell movements.
    this.boardService.reorderCells(this.board).subscribe();
  }
}
