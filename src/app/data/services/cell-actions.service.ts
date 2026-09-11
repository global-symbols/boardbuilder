import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {Cell} from '@data/models/cell.model';
import {Board} from '@data/models/board.model';
import {Media} from '@data/models/media.model';
import {Picto} from '@data/models/picto';
import {CellService} from '@data/services/cell.service';
import {BoardService} from '@data/services/board.service';
import {DialogService} from '@app/services/dialog.service';

export interface CellSnapshot {
  caption: string;
  background_colour: string;
  border_colour: string;
  text_colour: string;
  hair_colour: string;
  skin_colour: string;
  image_url: string;
  media_id: number;
  picto_id: number;
  media: Media;
  picto: Picto;
  linked_board_id: number;
  adaptable: boolean;
}

interface UndoEntry {
  restore: () => Observable<unknown>;
}

const MAX_UNDO = 5;

@Injectable({
  providedIn: 'root'
})
export class CellActionsService {

  private clipboard: CellSnapshot | null = null;
  private undoStack: UndoEntry[] = [];

  readonly canPaste$ = new BehaviorSubject<boolean>(false);
  readonly canUndo$ = new BehaviorSubject<boolean>(false);
  readonly mutated$ = new Subject<Cell>();
  readonly linksChanged$ = new Subject<void>();

  constructor(
    private cellService: CellService,
    private boardService: BoardService,
    private dialogService: DialogService
  ) {}

  get hasClipboard(): boolean {
    return !!this.clipboard;
  }

  resetUndo(): void {
    this.undoStack = [];
    this.canUndo$.next(false);
  }

  isFilled(cell: Cell): boolean {
    if (!cell) { return false; }
    return !!(
      cell.caption ||
      cell.image_url ||
      cell.background_colour ||
      cell.border_colour ||
      cell.text_colour ||
      cell.hair_colour ||
      cell.skin_colour ||
      cell.media_id ||
      cell.picto_id ||
      cell.linked_board_id
    );
  }

  copy(cell: Cell): void {
    if (!cell?.id) { return; }
    this.clipboard = this.snapshot(cell);
    this.canPaste$.next(true);
  }

  cut(cell: Cell, board: Board): Observable<Cell | null> {
    if (!cell?.id) { return of(null); }
    this.copy(cell);
    return this.clearCell(cell, true);
  }

  delete(cell: Cell, _board?: Board): Observable<Cell | null> {
    if (!cell?.id) { return of(null); }
    return this.clearCell(cell, true);
  }

  paste(cell: Cell, board: Board): Observable<Cell | null> {
    if (!this.clipboard || !cell?.id) { return of(null); }

    if (this.isFilled(cell)) {
      return this.dialogService.messageBox({
        heading: 'Replace cell contents?',
        content: 'This cell already has content. Replace it with the copied cell?',
        icon: 'content_paste',
        confirm: 'Replace',
        showCancel: true
      }).afterClosed().pipe(
        switchMap(confirmed => confirmed ? this.applyPaste(cell, board) : of(null))
      );
    }

    return this.applyPaste(cell, board);
  }

  swap(board: Board, source: Cell, target: Cell): Observable<Board | null> {
    if (!board || !source?.id || !target?.id || source === target) {
      return of(null);
    }

    const cells = board.cells;
    const i = cells.indexOf(source);
    const j = cells.indexOf(target);
    if (i < 0 || j < 0) { return of(null); }

    this.swapIndices(cells, i, j);
    board.cells = board.cells.slice();

    this.pushUndo({
      restore: () => {
        this.swapIndices(board.cells, i, j);
        board.cells = board.cells.slice();
        return this.boardService.reorderCells(board);
      }
    });

    return this.boardService.reorderCells(board);
  }

  undo(): Observable<unknown> {
    const entry = this.undoStack.pop();
    this.canUndo$.next(this.undoStack.length > 0);
    return entry ? entry.restore() : of(null);
  }

  private applyPaste(cell: Cell, board: Board): Observable<Cell> {
    const before = this.snapshot(cell);
    const hadLink = !!cell.linked_board_id;
    const toApply = {...this.clipboard};

    if (toApply.linked_board_id &&
        board.cells.some(c => c !== cell && c.linked_board_id === toApply.linked_board_id)) {
      toApply.linked_board_id = null;
    }

    this.applySnapshot(cell, toApply);

    this.pushUndo({
      restore: () => {
        this.applySnapshot(cell, before);
        return this.cellService.update(cell).pipe(
          tap(() => this.afterCellSaved(cell, hadLink || !!before.linked_board_id))
        );
      }
    });

    return this.cellService.update(cell).pipe(
      tap(() => this.afterCellSaved(cell, hadLink || !!toApply.linked_board_id))
    );
  }

  private clearCell(cell: Cell, recordUndo: boolean): Observable<Cell> {
    const before = this.snapshot(cell);
    const hadLink = !!cell.linked_board_id;
    this.applySnapshot(cell, this.emptySnapshot());

    if (recordUndo) {
      this.pushUndo({
        restore: () => {
          this.applySnapshot(cell, before);
          return this.cellService.update(cell).pipe(
            tap(() => this.afterCellSaved(cell, hadLink || !!before.linked_board_id))
          );
        }
      });
    }

    return this.cellService.update(cell).pipe(
      tap(() => this.afterCellSaved(cell, hadLink))
    );
  }

  private afterCellSaved(cell: Cell, linksMayHaveChanged: boolean): void {
    this.mutated$.next(cell);
    if (linksMayHaveChanged) {
      this.linksChanged$.next();
    }
  }

  private pushUndo(entry: UndoEntry): void {
    this.undoStack.push(entry);
    if (this.undoStack.length > MAX_UNDO) {
      this.undoStack.shift();
    }
    this.canUndo$.next(true);
  }

  private swapIndices(cells: Cell[], i: number, j: number): void {
    const tmp = cells[i];
    cells[i] = cells[j];
    cells[j] = tmp;
  }

  private snapshot(cell: Cell): CellSnapshot {
    return {
      caption: cell.caption,
      background_colour: cell.background_colour,
      border_colour: cell.border_colour,
      text_colour: cell.text_colour,
      hair_colour: cell.hair_colour,
      skin_colour: cell.skin_colour,
      image_url: cell.image_url,
      media_id: cell.media_id,
      picto_id: cell.picto_id,
      media: cell.media,
      picto: cell.picto,
      linked_board_id: cell.linked_board_id,
      adaptable: cell.adaptable
    };
  }

  private emptySnapshot(): CellSnapshot {
    return {
      caption: null,
      background_colour: null,
      border_colour: null,
      text_colour: null,
      hair_colour: null,
      skin_colour: null,
      image_url: null,
      media_id: null,
      picto_id: null,
      media: null,
      picto: null,
      linked_board_id: null,
      adaptable: false
    };
  }

  private applySnapshot(cell: Cell, snap: CellSnapshot): void {
    cell.caption = snap.caption;
    cell.background_colour = snap.background_colour;
    cell.border_colour = snap.border_colour;
    cell.text_colour = snap.text_colour;
    cell.hair_colour = snap.hair_colour;
    cell.skin_colour = snap.skin_colour;
    cell.image_url = snap.image_url;
    cell.media_id = snap.media_id;
    cell.picto_id = snap.picto_id;
    cell.media = snap.media;
    cell.picto = snap.picto;
    cell.linked_board_id = snap.linked_board_id;
    cell.adaptable = snap.adaptable;
  }
}
