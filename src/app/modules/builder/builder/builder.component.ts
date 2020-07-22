import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Board} from '@data/models/board.model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import { MatDialog } from '@angular/material/dialog';
import {BoardSet} from '@data/models/boardset.model';
import { saveAs } from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmDialogComponent} from '@shared/components/confirm-dialog/confirm-dialog.component';
import {ObfUploadDialogComponent} from '../../../obf-upload-dialog/obf-upload-dialog.component';
import {BoardEditorDialogComponent} from '../board-editor-dialog/board-editor-dialog.component';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';
import {Cell} from '@data/models/cell.model';
import {BoardSetEditorDialogComponent} from '../board-set-editor-dialog/board-set-editor-dialog.component';
import {ToolbarService} from '@app/services/toolbar.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
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

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private boardSetService: BoardSetService,
              private boardService: BoardService,
              private cellService: CellService,
              private hotkeysService: HotkeysService,
              private toolbarService: ToolbarService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);

    // Keyboard shortcut - delete Board
    this.hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      if (this.board) { this.deleteBoard(this.board); }
      return false; // Prevent bubbling
    }));

    // Keyboard shortcut - add Board
    this.hotkeysService.add(new Hotkey('a', (event: KeyboardEvent): boolean => {
      this.addBoard();
      return false; // Prevent bubbling
    }));
    // Keyboard shortcut - edit Board
    this.hotkeysService.add(new Hotkey('e', (event: KeyboardEvent): boolean => {
      if (this.board) { this.editBoard(this.board); }
      return false; // Prevent bubbling
    }));
  }

  ngOnInit() {

    // Get the BoardSet
    this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells').subscribe(bs => {

      this.boardSet = bs;

      // Update the opened_at date
      this.boardSetService.touch(this.boardSet).subscribe();

      // If there are any Boards, select the first one.
      if (this.boardSet.boards.length > 0) {
        this.selectBoard(this.boardSet.boards[0]);
        if (this.route.snapshot.queryParams.board) {
          this.selectBoard(this.boardSet.findBoard(this.route.snapshot.queryParams.board));
        }
      }
    });

    this.toolbarService.setButtons([{
      text: 'Board Sets',
      icon: 'arrow_back',
      routerLink: ['/', 'boardsets']
    }]);
  }

  addBoard() {
    this.boardService.add(new Board({
      name: 'Board ' + (this.boardSet.boards.length + 1),
      board_set_id: this.boardSet.id,
      rows: this.board?.rows,
      columns: this.board?.columns
    })).subscribe(board => {
      this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells').subscribe(bs => {
        this.boardSet = bs;
        this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
      });
    });
  }

  updateBoardSet() {
    return this.boardSetService.update(this.boardSet);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);

    this.toolbarService.clearButtons();
  }

  selectBoard(board?: Board) {
    this.board = board;
    this.selectedCell = undefined;
    // this.updateBoardSet().subscribe(r => null);
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
            if (this.boardSet.boards.length > 0) {
              this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
            }
          });
        });
      }

      this.deleteDialogRef = undefined;
    });
  }

  editBoard(board) {
    if (board === undefined) { return; }
    if (this.editDialogRef !== undefined) { return; }

    this.editDialogRef = this.dialog.open(BoardEditorDialogComponent, {
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

  editBoardSet() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardSetEditorDialogComponent, {
      width: '300px',
      data: { boardSet: this.boardSet }
    });

    this.currentDialogRef.afterClosed().subscribe(updatedBoardSet => {
      if (updatedBoardSet instanceof BoardSet) {
        // boardSet = updatedBoardSet;
        this.boardSetService.update(updatedBoardSet).subscribe();
      }

      this.currentDialogRef = undefined;
    });
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
