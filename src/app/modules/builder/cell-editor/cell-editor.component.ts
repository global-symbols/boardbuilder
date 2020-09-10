import {
  AfterContentInit, AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
import {Media} from '@data/models/media.model';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() boardSet: BoardSet;
  @Input() board: Board;
  @Input() cell: Cell;

  @Output() closed = new EventEmitter<boolean>();
  @Output() cellLinkedToBoard = new EventEmitter<boolean>();

  @ViewChild('searchPanel') searchPanel: CellEditorSearchPanelComponent;

  linkableBoards: Board[];

  constructor(
    public dialog: MatDialog,
    private cellService: CellService,
    private boardService: BoardService
  ) {
    this.linkableBoards = new Array<Board>();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    // this.cellService.get(this.cell.id, 'linkable_boards').subscribe(lb => console.log('linkable boards', lb));
  }

  // Save the Cell to the API when the component is destroyed
  ngOnDestroy() {
    if (this.cell) {
      this.cellService.update(this.cell).subscribe();
    }
  }

  // When an @Input is changed...
  ngOnChanges(changes: SimpleChanges) {
    // Save the Cell to the API when the selected cell is changed, either by selecting another Cell or closing the CellEditor...
    if (changes.cell?.previousValue) {
      this.cellService.update(changes.cell.previousValue).subscribe();
    }

    // Load linkable Boards when this.cell has a value
    if (changes.cell?.currentValue) {
      this.cellService.get(this.cell.id, 'linkable_boards').subscribe(lb => {
        // console.log('linkable boards', lb);
        this.linkableBoards = lb.linkable_boards;
      });
    }
  }

  closeEditor() {
    this.closed.emit(true);
  }

  selectImageUrl(url: string) {
    this.cell.image_url = url;
  }

  linkToBoardsList(): Array<Board> {
    return this.boardSet.boards.filter(b => b.id !== this.board.id && b.childBoards().length === 0);
  }

  linkCellToBoard(event: MatSelectChange) {
    const linkedBoardId = event.value;
    console.log('linking to board', linkedBoardId);
    this.cell.linked_board_id = linkedBoardId;
    console.log('linked', this.cell.linked_board_id);

    this.cellService.update(this.cell).subscribe(success => this.cellLinkedToBoard.emit(true));
  }

  unlinkCellFromBoard() {
    this.cell.linked_board_id = null;

    this.cellService.update(this.cell).subscribe(success => this.cellLinkedToBoard.emit(true));
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

  selectMedia(media: Media) {
    this.cell.media = media;
    this.cell.media_id = media.id;
    this.cell.image_url = media.public_url;
  }
}
