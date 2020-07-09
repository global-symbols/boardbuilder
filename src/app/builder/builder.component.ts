import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {LocalBoardSetService} from '@data/services/local-board-set.service';
import {Board} from '@data/models/board.model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {BoardEditorComponent} from '../board-editor/board-editor.component';
import {BoardSet} from '@data/models/boardset.model';
import { saveAs } from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';
import {ObfUploadDialogComponent} from '../obf-upload-dialog/obf-upload-dialog.component';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit, OnDestroy {

  boardSet: BoardSet;
  board: Board;
  selectedCell;

  disableCellEditorAnimations = true;

  mobileQuery: MediaQueryList;

  private readonly mobileQueryListener: () => void;

  private deleteDialogRef;
  private editDialogRef;
  private currentDialogRef;

  private saveTimer: Subscription;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private service: LocalBoardSetService,
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
    // Get the BoardSet
    this.getBoardSet().then(bs => {
      // If there are any Boards, select the first one.
      if (this.boardSet.boards.length > 0) {
        this.selectBoard(this.boardSet.boards[0]);
        if (this.route.snapshot.queryParams.board) {
          console.log('selecting board ', this.route.snapshot.queryParams.board);
          this.selectBoard(this.boardSet.findBoard(this.route.snapshot.queryParams.board));
        }
      }
    });
  }

  private getBoardSet() {
    return this.service.getBoardSet(this.route.snapshot.paramMap.get('id')).then(bs => {

      // Start a timer to auto-save the BoardSet.
      this.saveTimer = interval(10000).subscribe(val => this.updateBoardSet().then());

      return this.boardSet = bs;
    });
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

  deleteBoard(board: Board) {
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
    saveAs(new Blob([JSON.stringify(board.toObf(), null, 2)], {type: 'text/plain;charset=utf-8'}), board.title + '.obf');
  }

  uploadBoardObf(board: Board) {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ObfUploadDialogComponent, {
      width: '500px'
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      if (result instanceof Board) {
        // Add the new Board to the BoardSet
        this.boardSet.boards.push(result);
        // Select the new Board
        this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
      }
      this.currentDialogRef = undefined;
    });
  }

  downloadBoardSetObz() {
    this.service.convertToObz(this.boardSet).then(content => saveAs(content, this.boardSet.title + '.obz'));
  }

  generatePdf() {
    this.updateBoardSet()
      .then(r => this.router.navigate(['/', 'boardsets', this.boardSet.uuid, this.board.uuid, 'pdf']));
  }
}
