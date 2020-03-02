import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {BoardSetService} from '../board-set.service';
import {Board} from '../models/board.model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {BoardEditorComponent} from '../board-editor/board-editor.component';
import {BoardSet} from '../models/boardset.model';
import { saveAs } from 'file-saver';
import {PdfDialogComponent} from '../pdf-dialog/pdf-dialog.component';
import {Observable} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {BoardsetEditorDialogComponent} from '../boardset-editor-dialog/boardset-editor-dialog.component';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit, OnDestroy {

  boardSet: BoardSet;
  board: Board;
  boardSet$: Promise<BoardSet>;
  selectedCell;

  disableCellEditorAnimations = true;

  mobileQuery: MediaQueryList;

  private readonly mobileQueryListener: () => void;

  private deleteDialogRef;
  private editDialogRef;
  private currentDialogRef;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private service: BoardSetService,
              private hotkeysService: HotkeysService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    // Keyboard shortcut - delete Board
    this.hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.deleteBoard(this.board);
      return false; // Prevent bubbling
    }));

    // Keyboard shortcut - add Board
    this.hotkeysService.add(new Hotkey('a', (event: KeyboardEvent): boolean => {
      this.addBoard();
      return false; // Prevent bubbling
    }));
    // Keyboard shortcut - edit Board
    this.hotkeysService.add(new Hotkey('e', (event: KeyboardEvent): boolean => {
      this.editBoard(this.board);
      return false; // Prevent bubbling
    }));
  }

  ngOnInit() {
    // Get the BoardSet, then select the first Board.
    this.getBoardSet().then(bs => {
      if (this.boardSet.boards.length > 0) { this.selectBoard(this.boardSet.boards[0]); }
    });
  }

  private getBoardSet() {
    return this.service.getBoardSet(this.route.snapshot.paramMap.get('id')).then(bs => this.boardSet = bs);
  }

  addBoard() {
    this.boardSet.addBoard();
    this.updateBoardSet().then(r => null);
    this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
  }

  updateBoardSet() {
    return this.service.updateBoardSet(this.boardSet).then(r => null);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  selectBoard(board?: Board) {
    this.board = board;
    this.selectedCell = undefined;
    this.updateBoardSet().then(r => null);
  }

  deleteBoard(board) {
    if (board === undefined) { return; }
    if (this.deleteDialogRef !== undefined) { return; }

    this.deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {heading: 'Delete this Board?', content: 'This cannot be undone.'}
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.selectBoard(null);
        this.boardSet.deleteBoard(board);
        this.updateBoardSet().then(r => null);
        this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
      }

      this.deleteDialogRef = undefined;
    });
  }

  editBoard(board) {
    if (board === undefined) { return; }
    if (this.editDialogRef !== undefined) { return; }

    this.editDialogRef = this.dialog.open(BoardEditorComponent, {
      width: '300px',
      data: { board: this.board }
    });

    this.editDialogRef.afterClosed().subscribe(result => {
      this.editDialogRef = undefined;
      this.updateBoardSet().then(r => null);
    });

  }

  downloadBoard(board: Board) {
    console.log(board.toObf());
    saveAs(new Blob([JSON.stringify(board.toObf())], {type: 'text/plain;charset=utf-8'}), board.title + '.obf');
  }

  pdfDialog(board) {
    if (board === undefined) { return; }
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(PdfDialogComponent, {
      width: '600px',
      data: this.board
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      this.currentDialogRef = undefined;
    });
  }

  editBoardSet() {
    if (this.boardSet === undefined) { return; }
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardsetEditorDialogComponent, {
      width: '300px',
      data: { boardSet: this.boardSet }
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      this.currentDialogRef = undefined;
      this.updateBoardSet().then(r => null);
    });
  }

  deleteBoardSet(boardset) {
    if (boardset === undefined) { return; }
    if (this.deleteDialogRef !== undefined) { return; }

    this.deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {heading: 'Delete this Board Set?', content: 'This will delete all Boards in the Board Set, and cannot be undone.'}
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.selectBoard(null);
        this.service.delete(this.boardSet).then(bs => {
          this.deleteDialogRef = undefined;
          this.router.navigate(['/', 'boardsets']).then();
        });
      }

      this.deleteDialogRef = undefined;
    });
  }
}
