import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Board} from '@data/models/board.model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import { MatDialog } from '@angular/material/dialog';
import {BoardSet} from '@data/models/boardset.model';
import { saveAs } from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, Observable, Subscription} from 'rxjs';
import {ConfirmDialogComponent} from '@shared/components/confirm-dialog/confirm-dialog.component';
import {ObfUploadDialogComponent} from '../../../obf-upload-dialog/obf-upload-dialog.component';
import {BoardEditorComponent} from '../../../board-editor/board-editor.component';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';
import {Cell} from '@data/models/cell.model';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit, OnDestroy {

  boardSet$: Observable<BoardSet>;
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
              private boardSetService: BoardSetService,
              private boardService: BoardService,
              private cellService: CellService,
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
    this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells').subscribe(bs => {
      // Start a timer to auto-save the BoardSet.
      //this.saveTimer = interval(10000).subscribe(val => this.updateBoardSet().subscribe());

      this.boardSet = bs;

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

  addBoard() {
    this.boardService.add(new Board({
      name: 'Board ' + (this.boardSet.boards.length + 1),
      board_set_id: this.boardSet.id
    })).subscribe(board => {
      this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells').subscribe(bs => {
        this.boardSet = bs;
      });
    });

    // this.boardSet.addBoard();
    // this.updateBoardSet().subscribe(r => null);
    // this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
  }

  updateBoardSet() {
    return this.boardSetService.update(this.boardSet);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  selectBoard(board?: Board) {
    this.board = board;
    this.selectedCell = undefined;
    this.updateBoardSet().subscribe(r => null);
  }

  deleteBoard(board: Board) {
    if (board === undefined) { return; }
    if (this.deleteDialogRef !== undefined) { return; }

    this.deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {heading: `Delete '${board.name}'?`, content: 'This cannot be undone.'}
    });

    this.deleteDialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.selectBoard(null);

        this.boardService.delete(board).subscribe(r => {
          this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells').subscribe(bs => {
            this.boardSet = bs;
            this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
          });
        });
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
      this.boardService.update(board).subscribe();
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
    // this.service.convertToObz(this.boardSet).then(content => saveAs(content, this.boardSet.title + '.obz'));
  }

  generatePdf() {
    this.updateBoardSet()
      .subscribe(r => this.router.navigate(['/', 'boardsets', this.boardSet.uuid, this.board.uuid, 'pdf']));
  }

  updateCell(cell: Cell) {
    this.cellService.update(cell).subscribe();
  }
}
