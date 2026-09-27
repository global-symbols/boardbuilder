import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CDK_DRAG_CONFIG, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {DialogService} from '@app/services/dialog.service';
import {Media} from '@data/models/media.model';

interface BoardChip {
  id: number;
  name: string;
  columns: number;
  rows: number;
}

interface BookPage {
  clientKey: string;
  tabId: number | null;
  boardId: number;
  colour: string;
  image_url: string;
}

const PAGE_COLOURS = ['#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5', '#C45911', '#7030A0'];

@Component({
  selector: 'app-printable-book-dialog',
  templateUrl: './printable-book-dialog.component.html',
  styleUrls: ['./printable-book-dialog.component.scss'],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: { zIndex: 10000 } }]
})
export class PrintableBookDialogComponent {
  enabled = false;
  edge: 'top' | 'bottom' | 'left' | 'right';
  layoutColumns = 0;
  layoutRows = 0;
  layoutCells: number[] = [];
  layoutEditing = false;
  draftColumns = 0;
  draftRows = 0;
  boards: BoardChip[] = [];
  pages: BookPage[] = [];
  selected: { [boardId: number]: boolean } = {};
  saving = false;
  error: string;
  private nextKey = 1;
  private savedSignature = '';

  constructor(
    public dialogRef: MatDialogRef<PrintableBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public boardSet: BoardSet,
    private boardSetService: BoardSetService,
    private dialogService: DialogService
  ) {
    this.enabled = boardSet.catalogue_tabs === true;
    this.edge = boardSet.tab_edge || 'right';
    const firstBoard = (boardSet.boards || [])
      .filter(board => !!board.id)
      .slice()
      .sort((a, b) => (a.index || 0) - (b.index || 0) || a.id - b.id)[0];
    this.layoutColumns = firstBoard ? firstBoard.columns || 0 : 0;
    this.layoutRows = firstBoard ? firstBoard.rows || 0 : 0;
    this.rebuildLayoutCells();
    this.boards = (boardSet.boards || [])
      .filter(board => !!board.id)
      .slice()
      .sort((a, b) => (a.index || 0) - (b.index || 0) || a.id - b.id)
      .map(board => ({ id: board.id, name: board.name, columns: board.columns || 0, rows: board.rows || 0 }));

    const pages: BookPage[] = [];
    (boardSet.tabs || [])
      .slice()
      .sort((a, b) => (a.position || 0) - (b.position || 0) || a.id - b.id)
      .forEach(tab => {
        const boardIds = (tab.board_ids || []).filter(id => this.boards.some(board => board.id === id));
        boardIds.forEach((boardId, index) => {
          if (!this.matchesLayoutId(boardId)) { return; }
          if (pages.some(page => page.boardId === boardId)) { return; }
          pages.push({
            clientKey: 'page-' + tab.id + '-' + boardId,
            tabId: boardIds.length === 1 && index === 0 ? tab.id : null,
            boardId,
            colour: tab.colour || '#4472C4',
            image_url: tab.image_url || ''
          });
        });
      });
    this.pages = pages;
    this.savedSignature = this.signature();
  }

  get canSave(): boolean {
    return !this.saving && this.signature() !== this.savedSignature;
  }

  get selectedCount(): number {
    return this.boards.filter(board => this.selected[board.id] && this.canAdd(board)).length;
  }

  startLayoutEdit() {
    this.draftColumns = this.layoutColumns;
    this.draftRows = this.layoutRows;
    this.layoutEditing = true;
    this.error = null;
  }

  saveLayout() {
    const columns = Math.floor(Number(this.draftColumns));
    const rows = Math.floor(Number(this.draftRows));
    if (!columns || !rows || columns < 1 || rows < 1 || columns > 50 || rows > 50) {
      this.error = 'Columns and rows must be between 1 and 50.';
      return;
    }
    const changed = columns !== this.layoutColumns || rows !== this.layoutRows;
    if (changed && this.pages.length && !window.confirm('Changing the layout will reset the tab order below.')) {
      return;
    }
    this.layoutColumns = columns;
    this.layoutRows = rows;
    this.rebuildLayoutCells();
    if (changed) {
      this.pages = [];
      this.selected = {};
    }
    this.layoutEditing = false;
    this.error = null;
  }

  get previewColumns(): number {
    return this.layoutEditing ? this.draftDimension(this.draftColumns, this.layoutColumns) : this.layoutColumns;
  }

  get previewRows(): number {
    return this.layoutEditing ? this.draftDimension(this.draftRows, this.layoutRows) : this.layoutRows;
  }

  get previewCells(): number[] {
    const count = this.previewColumns * this.previewRows;
    if (count <= 0 || count > 80) { return []; }
    return Array.from({ length: count }, (_, index) => index);
  }

  matchesLayout(board: BoardChip): boolean {
    return board.columns === this.layoutColumns && board.rows === this.layoutRows;
  }

  boardName(id: number): string {
    const board = this.boards.find(item => item.id === id);
    return board ? board.name : '';
  }

  inBook(boardId: number): boolean {
    return this.pages.some(page => page.boardId === boardId);
  }

  canAdd(board: BoardChip): boolean {
    return this.matchesLayout(board) && !this.inBook(board.id);
  }

  private draftDimension(value: number, fallback: number): number {
    const parsed = Math.floor(Number(value));
    return parsed >= 1 && parsed <= 50 ? parsed : fallback;
  }

  private rebuildLayoutCells() {
    const cellCount = this.layoutColumns * this.layoutRows;
    this.layoutCells = Array.from({ length: cellCount > 0 && cellCount <= 80 ? cellCount : 0 }, (_, index) => index);
  }

  private matchesLayoutId(boardId: number): boolean {
    const board = this.boards.find(item => item.id === boardId);
    return !!board && this.matchesLayout(board);
  }

  toggleSelected(boardId: number, checked: boolean) {
    const board = this.boards.find(item => item.id === boardId);
    if (!board || !this.canAdd(board)) { return; }
    this.selected = { ...this.selected, [boardId]: checked };
  }

  addSelected() {
    const ids = this.boards
      .filter(board => this.selected[board.id] && this.canAdd(board))
      .map(board => board.id);
    if (!ids.length) { return; }
    const start = this.pages.length;
    this.pages = this.pages.concat(ids.map((id, index) => this.makePage(id, start + index)));
    this.selected = {};
  }

  removePage(page: BookPage) {
    this.pages = this.pages.filter(item => item !== page);
  }

  onBoardListDrop(event: CdkDragDrop<BoardChip[]>) {
    if (event.previousContainer !== event.container) { return; }
  }

  onBookDrop(event: CdkDragDrop<BookPage[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
      this.pages = this.pages.slice();
      return;
    }
    const boardId = event.item.data as number;
    if (!boardId) { return; }
    const dragged = this.boards.find(board => board.id === boardId);
    const ids = this.selected[boardId]
      ? this.boards.filter(board => this.selected[board.id] && this.canAdd(board)).map(board => board.id)
      : (dragged && this.canAdd(dragged) ? [boardId] : []);
    if (!ids.length) { return; }
    const at = event.currentIndex;
    this.pages = this.pages.slice(0, at).concat(ids.map((id, index) => this.makePage(id, this.pages.length + index)), this.pages.slice(at));
    ids.forEach(id => delete this.selected[id]);
    this.selected = { ...this.selected };
  }

  pickSymbol(page: BookPage) {
    this.dialogService.openMediaLibrary({
      sources: ['symbols', 'user_media'],
      allowClear: true
    }).afterClosed().subscribe((media: Media) => {
      if (media === undefined) { return; }
      page.image_url = media && media.public_url ? media.public_url : '';
    });
  }

  onEnabledChange(enabled: boolean) {
    if (this.saving) { return; }
    const previous = this.enabled;
    this.enabled = enabled;
    this.persist(false, previous);
  }

  save() {
    this.persist(false);
  }

  private signature(): string {
    return JSON.stringify({
      edge: this.edge,
      pages: this.pages.map(page => ({
        boardId: page.boardId,
        colour: page.colour,
        image_url: page.image_url || ''
      }))
    });
  }

  private persist(closeOnSuccess: boolean, revertEnabled?: boolean) {
    if (this.saving) { return; }
    this.saving = true;
    this.error = null;
    this.boardSetService.saveTabs(this.boardSet.id, {
      catalogue_tabs: this.enabled,
      tab_edge: this.edge,
      tabs: this.pages.map((page, index) => {
        const name = (this.boardName(page.boardId) || 'Tab').trim().slice(0, 50);
        const row: {
          id?: number;
          label: string;
          colour: string;
          image_url: string;
          position: number;
          board_ids: number[];
        } = {
          label: name || 'Tab',
          colour: page.colour,
          image_url: page.image_url || '',
          position: index,
          board_ids: [page.boardId]
        };
        if (page.tabId) { row.id = page.tabId; }
        return row;
      })
    }).subscribe(
      result => {
        this.saving = false;
        this.boardSet.catalogue_tabs = result.catalogue_tabs;
        this.boardSet.tab_edge = result.tab_edge;
        this.boardSet.tabs = result.tabs || [];
        this.enabled = result.catalogue_tabs === true;
        (result.tabs || []).forEach(tab => {
          const boardId = tab.board_ids && tab.board_ids[0];
          const page = this.pages.find(item => item.boardId === boardId);
          if (page && tab.board_ids && tab.board_ids.length === 1) { page.tabId = tab.id; }
        });
        this.savedSignature = this.signature();
        if (closeOnSuccess) { this.dialogRef.close(result); }
      },
      err => {
        this.saving = false;
        if (revertEnabled !== undefined) { this.enabled = revertEnabled; }
        this.error = err?.error?.error || 'Could not save tab printer settings.';
      }
    );
  }

  private makePage(boardId: number, colourIndex: number): BookPage {
    const colour = PAGE_COLOURS[colourIndex % PAGE_COLOURS.length];
    return {
      clientKey: 'new-' + (this.nextKey++),
      tabId: null,
      boardId,
      colour,
      image_url: ''
    };
  }
}
