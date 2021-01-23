import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Cell} from '@data/models/cell.model';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';
import {Media} from '@data/models/media.model';
import {SearchPanelComponent} from '@shared/components/search-panel/search-panel.component';
import {SymbolSearchResult} from '@data/models/symbol-search-result';
import {colourPickerColours} from '@data/colour-picker-colours';
import {Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent implements OnChanges, OnDestroy {

  @Input() boardSet: BoardSet;
  @Input() board: Board;
  @Input() cell: Cell;

  @Output() closed = new EventEmitter<boolean>();
  @Output() cellLinkedToBoard = new EventEmitter<boolean>();

  @ViewChild('searchPanel') searchPanel: SearchPanelComponent;

  linkableBoards$: Observable<Board[]>;
  linkedBoard: Board;

  colourPickerColours: Array<string>;

  constructor(
    public dialog: MatDialog,
    private cellService: CellService,
    private boardService: BoardService
  ) {
    this.colourPickerColours = colourPickerColours;
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
      this.loadLinkableBoards();
      this.loadLinkedBoard();
    }
  }

  loadLinkableBoards(): void {
    this.linkableBoards$ = this.cellService.get(this.cell.id, 'linkable_boards').pipe(map(cell => cell.linkable_boards));
    // this.cellService.get(this.cell.id, 'linkable_boards').subscribe(lb => this.linkableBoards = lb.linkable_boards);
  }

  loadLinkedBoard(): void {
    // If this Cell links to a Board, load the linked Board so we have a title, etc.
    if (this.cell.linked_board_id) {
      this.boardService.get(this.cell.linked_board_id)
        .subscribe(linkedBoard => this.linkedBoard = linkedBoard);
    }
  }

  closeEditor() {
    this.closed.emit(true);
  }

  selectSearchResult(result: SymbolSearchResult) {
    this.cell.media = null;
    this.cell.media_id = null;
    this.cell.image_url = result.imageUrl;
    this.cell.picto_id = result.pictoId;
  }

  linkToBoardsList(): Array<Board> {
    return this.boardSet.boards.filter(b => b.id !== this.board.id && b.childBoards().length === 0);
  }

  linkCellToBoard(event: MatSelectChange) {
    this.cell.linked_board_id = event.value;
    this.cellService.update(this.cell).subscribe(success => {
      this.cellLinkedToBoard.emit(true);
      this.loadLinkedBoard();
    });
  }

  unlinkCellFromBoard() {
    this.cell.linked_board_id = null;
    this.linkedBoard = null;

    this.cellService.update(this.cell).subscribe(success => {
      this.cellLinkedToBoard.emit(true);
      this.loadLinkableBoards();
    });
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

  // Sets the Cell's image URL for an image from the User's page library.
  selectMedia(media: Media) {
    // Remove any Picto that was present in the Cell.
    this.cell.picto_id = null;

    // Set the selected Media item instead.
    this.cell.media = media;
    this.cell.media_id = media.id;
    this.cell.image_url = media.public_url;
  }
}
