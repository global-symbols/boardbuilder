import {ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatMenuTrigger} from '@angular/material/menu';
import {Board} from '@data/models/board.model';
import {Cell} from '@data/models/cell.model';
import {DialogService} from '@app/services/dialog.service';
import {Media} from '@data/models/media.model';
import {BoardService} from '@data/services/board.service';
import {CellActionsService} from '@data/services/cell-actions.service';

const LONG_PRESS_MS = 550;
const LONG_PRESS_MOVE_PX = 12;

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss'],
  animations: [
    trigger('mediaCollapse', [
      state('initial', style({height: '*', opacity: 1, transform: 'scale(1)'})),
      state('animate', style({height: '*', opacity: 1, transform: 'scale(1)'})),
      transition('void => animate', [
        style({height: 0, opacity: 0, transform: 'scale(0.98)'}),
        animate('180ms ease-out', style({height: '*', opacity: 1, transform: 'scale(1)'}))
      ]),
      transition('animate => void', [
        style({height: '*', opacity: 1, transform: 'scale(1)'}),
        animate('180ms ease-in', style({height: 0, opacity: 0, transform: 'scale(0.98)'}))
      ])
    ]),
    trigger('captionTransition', [
      transition('withImage => noImage', [
        animate('180ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ]),
      transition('noImage => withImage', [
        animate('180ms ease-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  ]
})
export class BoardDetailComponent implements OnChanges {

  @Input() board: Board;
  @Input() cell: Cell;
  @Input() readonly = false;
  @Output() cellChange = new EventEmitter<Cell>();
  @Output() boardChange = new EventEmitter<number>();

  @ViewChild(MatMenuTrigger) cellMenuTrigger: MatMenuTrigger;

  isInitialLoad = true;
  contextCell: Cell;
  menuPosition = {x: 0, y: 0};
  menuOpen = false;

  private didDrag = false;
  private longPressFired = false;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private touchOrigin: {x: number, y: number} | null = null;

  constructor(
    private dialogService: DialogService,
    private boardService: BoardService,
    public cellActions: CellActionsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    if (this.isInitialLoad && this.board) {
      setTimeout(() => this.isInitialLoad = false, 100);
    }
  }

  selectCell(cell: Cell) {
    this.cellChange.emit(cell);
  }

  onCellClick(cell: Cell) {
    if (this.didDrag || this.longPressFired) {
      this.didDrag = false;
      this.longPressFired = false;
      return;
    }
    this.selectCell(cell);
  }

  // The menu backdrop swallows the click that closes it, so the cell underneath
  // never receives click. Select from the pointer position instead.
  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent) {
    if (!this.menuOpen || event.button > 0) { return; }
    const target = event.target as HTMLElement;
    if (target?.closest('.mat-menu-panel')) { return; }
    const cell = this.cellFromPoint(event.clientX, event.clientY);
    if (cell) {
      this.selectCell(cell);
    }
  }

  onDragStarted() {
    this.didDrag = true;
    this.clearLongPressTimer();
  }

  dropOnCell(event: CdkDragDrop<Cell>, target: Cell) {
    if (this.readonly) { return; }
    const source = event.item.data as Cell;
    if (!source || source === target) { return; }
    this.cellActions.swap(this.board, source, target).subscribe();
  }

  onContextMenu(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    event.stopPropagation();
    if (this.readonly) { return; }
    this.openCellMenu(event.clientX, event.clientY, cell);
  }

  onTouchStart(event: TouchEvent, cell: Cell) {
    if (this.readonly) { return; }
    const touch = event.touches[0];
    if (!touch) { return; }
    this.longPressFired = false;
    this.touchOrigin = {x: touch.clientX, y: touch.clientY};
    this.clearLongPressTimer();
    this.longPressTimer = setTimeout(() => {
      this.longPressFired = true;
      this.openCellMenu(touch.clientX, touch.clientY, cell);
    }, LONG_PRESS_MS);
  }

  onTouchMove(event: TouchEvent) {
    if (!this.touchOrigin || !this.longPressTimer) { return; }
    const touch = event.touches[0];
    if (!touch) { return; }
    const dx = touch.clientX - this.touchOrigin.x;
    const dy = touch.clientY - this.touchOrigin.y;
    if (Math.hypot(dx, dy) > LONG_PRESS_MOVE_PX) {
      this.clearLongPressTimer();
    }
  }

  onTouchEnd(event: TouchEvent) {
    if (this.longPressFired) {
      event.preventDefault();
    }
    this.clearLongPressTimer();
    this.touchOrigin = null;
  }

  onMenuClosed() {
    this.menuOpen = false;
    this.longPressFired = false;
  }

  copyContextCell() {
    if (this.contextCell) { this.cellActions.copy(this.contextCell); }
  }

  cutContextCell() {
    if (this.contextCell) {
      this.cellActions.cut(this.contextCell, this.board).subscribe();
    }
  }

  pasteContextCell() {
    if (this.contextCell) {
      this.cellActions.paste(this.contextCell, this.board).subscribe();
    }
  }

  deleteContextCell() {
    if (this.contextCell) {
      this.cellActions.delete(this.contextCell, this.board).subscribe();
    }
  }

  undoAction() {
    this.cellActions.undo().subscribe();
  }

  showBoard(linkedBoardId: number) {
    this.boardChange.emit(linkedBoardId);
  }

  selectHeaderImage() {
    this.dialogService.openMediaLibrary({
      sources: ['user_media'],
      allowClear: !!this.board.header_media
    }).afterClosed().subscribe(media => {
      if (media) {
        media.id ? this.setBoardHeaderMedia(media) : this.clearBoardHeaderMedia();
      }
    });
  }

  setBoardHeaderMedia(media: Media) {
    this.board.header_media = media;
    this.board.header_media_id = media.id;
    this.boardService.update(this.board).subscribe();
  }

  clearBoardHeaderMedia() {
    this.board.header_media = null;
    this.board.header_media_id = null;
    this.boardService.update(this.board).subscribe();
  }

  private openCellMenu(x: number, y: number, cell: Cell) {
    this.contextCell = cell;
    this.menuPosition = {x, y};
    this.selectCell(cell);
    this.menuOpen = true;
    this.cdr.detectChanges();
    this.cellMenuTrigger.openMenu();
  }

  private clearLongPressTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private cellFromPoint(x: number, y: number): Cell | null {
    if (!this.board?.cells) { return null; }
    const stack = document.elementsFromPoint(x, y);
    for (const el of stack) {
      if (!(el instanceof Element)) { continue; }
      if (el.classList.contains('cdk-overlay-backdrop') || el.closest('.mat-menu-panel')) {
        continue;
      }
      const host = el.closest('[data-cell-index]') as HTMLElement | null;
      if (!host) { continue; }
      const index = Number(host.getAttribute('data-cell-index'));
      if (Number.isNaN(index)) { return null; }
      return this.board.cells[index] || null;
    }
    return null;
  }
}
