import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from '@env';
import {MediaMatcher} from '@angular/cdk/layout';
import {Clipboard} from '@angular/cdk/clipboard';
import {Board} from '@data/models/board.model';
import {Hotkey, HotkeysService} from '@conflito/angular2-hotkeys';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BoardSet} from '@data/models/boardset.model';
import {saveAs} from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmDialogComponent} from '@shared/components/confirm-dialog/confirm-dialog.component';
import {ObfUploadDialogComponent} from '../../../obf-upload-dialog/obf-upload-dialog.component';
import {BoardEditorDialogComponent} from '../board-editor-dialog/board-editor-dialog.component';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';
import {BoardSetEditorDialogComponent} from '../board-set-editor-dialog/board-set-editor-dialog.component';
import {ToolbarService} from '@app/services/toolbar.service';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CopyBoardSetDialogComponent} from '@shared/components/copy-board-set-dialog/copy-board-set-dialog.component';
import {DialogService} from '@app/services/dialog.service';
import {Cell} from '@data/models/cell.model';
import {BoardTreeComponent} from '@modules/builder/board-tree/board-tree.component';
import {CellEditorComponent} from '@modules/builder/cell-editor/cell-editor.component';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit, OnDestroy {

  boardSet: BoardSet;
  board: Board;
  selectedCell;

  loading: boolean;
  loadingError = false;

  disableCellEditorAnimations = true;

  cellEditorMobileQuery: MediaQueryList;
  boardTreeMobileQuery: MediaQueryList;
  private readonly mobileQueryListener: () => void;

  @ViewChild(BoardTreeComponent) boardTree: BoardTreeComponent;
  @ViewChild(CellEditorComponent) cellEditor: CellEditorComponent;

  private currentDialogRef;
  private hotkeys: Array<Hotkey | Hotkey[]> = [];

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private boardSetService: BoardSetService,
              private boardService: BoardService,
              private cellService: CellService,
              private hotkeysService: HotkeysService,
              private toolbarService: ToolbarService,
              private dialogService: DialogService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private clipboard: Clipboard,
              private snackBar: MatSnackBar
  ) {
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();

    this.boardTreeMobileQuery = media.matchMedia('(max-width: 900px)');
    this.boardTreeMobileQuery.addListener(this.mobileQueryListener);

    this.cellEditorMobileQuery = media.matchMedia('(max-width: 1400px)');
    this.cellEditorMobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
    this.loading = true;
    this.getBoardSet().subscribe(bs => {

      // Update the opened_at date, unless this is a readonly boardset
      if (!this.boardSet.readonly) {
        this.boardSetService.touch(this.boardSet).subscribe();
      }

      // If there are any Boards, select the first one.
      if (this.boardSet.boards.length > 0) {
        this.selectBoard(this.boardSet.boards[0]);
      }
    },
      err => null,
      () => this.loading = false);

    this.toolbarService.setButtons([{
      text: 'Board Sets',
      icon: 'arrow_back',
      action: () => this.router.navigate(['/', 'boardsets'])
    }], [{
      tooltip: 'Keyboard Shortcuts',
      icon: 'keyboard',
      action: () => this.hotkeysService.cheatSheetToggle.next()
    }]);

    // Keyboard shortcut - main menu
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+backspace', 'command+backspace'], (event: KeyboardEvent): boolean => {
        this.router.navigate(['/', 'boardsets']);
        return false; // Prevent bubbling
      }, undefined, 'Return to Main Menu'))
    );

    // Keyboard shortcut - edit Board
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+s', 'command+s'], (event: KeyboardEvent): boolean => {
        if (this.boardSet) {
          this.editBoardSet();
        }
        return false; // Prevent bubbling
      }, undefined, 'Edit Board Set'))
    );

    // Keyboard shortcut - add Board
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+enter', 'command+enter'], (event: KeyboardEvent): boolean => {
        this.addBoard();
        return false; // Prevent bubbling
      }, undefined, 'Add Board'))
    );

    // Keyboard shortcut - edit Board
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+e', 'command+e'], (event: KeyboardEvent): boolean => {
        if (this.board) {
          this.editBoard(this.board);
        }
        return false; // Prevent bubbling
      }, undefined, 'Edit Current Board'))
    );

    // Keyboard shortcut - delete Board
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+del', 'command+del'], (event: KeyboardEvent): boolean => {
        if (this.board) {
          this.deleteBoard(this.board);
        }
        return false; // Prevent bubbling
      }, undefined, 'Delete Current Board'))
    );

    // Keyboard shortcut - clear Cell
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['del'], (event: KeyboardEvent): boolean => {
        if (this.selectedCell) {
          this.cellEditor.clearCell();
        }
        return false; // Prevent bubbling
      }, undefined, 'Clear Selected Cell'))
    );
  }

  ngOnDestroy(): void {
    this.boardTreeMobileQuery.removeListener(this.mobileQueryListener);

    // Clear navbar buttons
    this.toolbarService.clearButtons();

    // Unassign all keyboard shortcuts
    [].concat(...this.hotkeys).map(hotkey => this.hotkeysService.remove(hotkey));
  }

  // Gets the BoardSet and loads it into this.boardSet.
  private getBoardSet(): Observable<BoardSet> {
    this.loadingError = false;
    this.loading = true;
    return this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells boards.cells.picto boards.cells.picto.image boards.header_media')
      .pipe(
        catchError(e => {
          this.loadingError = true;
          this.loading = false;
          return throwError(e);
        }),
        map(bs => {
          this.loading = false;
          return this.boardSet = bs;
        })
      );
  }

  // Loads (or re-loads) the current BoardSet.
  // If re-loading, this also re-selects the selected Board after the reload.
  loadBoardSet() {
    const currentBoard = this.board;
    // Get the BoardSet
    this.getBoardSet().subscribe(boardSet => {
      if (currentBoard) { this.selectBoard(currentBoard.id, this.selectedCell?.id); }
    });
  }

  addBoard() {
    if (this.boardSet.readonly) { return; }

    if (this.currentDialogRef !== undefined) { return; }

    const newBoard = new Board({
      name: 'Board ' + (this.boardSet.boards.length + 1),
      board_set_id: this.boardSet.id,
      rows: this.board?.rows,
      columns: this.board?.columns,
      captions_position: this.board?.captions_position
    });

    this.currentDialogRef = this.dialog.open(BoardEditorDialogComponent, {
      width: '700px',
      data: { board: newBoard }
    });

    this.currentDialogRef.afterClosed().subscribe(confirmed => {

      this.currentDialogRef = undefined;

      if (confirmed) {
        this.boardService.add(newBoard).subscribe(result => {
          this.getBoardSet().subscribe(bs => {
            this.selectLastBoard();
          });
        });
      }
    });
  }

  updateBoardSet() {
    if (this.boardSet.readonly) { return; }
    return this.boardSetService.update(this.boardSet);
  }

  selectBoard(board?: Board | number, cell?: Cell | number) {
    if (typeof board === 'number') {
      this.board = this.boardSet.boards.find(b => b.id === board);
    } else {
      this.board = board;
    }

    if (typeof cell === 'number') {
      this.selectedCell = this.board.cells.find(c => c.id === cell);
    } else {
      this.selectedCell = undefined;
    }
  }

  selectLastBoard() {
    if (this.boardSet.boards.length > 0) {
      this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
    }
  }

  deleteBoard(board: Board) {
    if (this.boardSet.readonly) { return; }
    if (this.currentDialogRef !== undefined) { return; }

    this.dialogService.delete({
      heading: `Delete '${board.name}'?`,
      content: 'This cannot be undone.'
    }).afterClosed().subscribe(result => {

      if (result) {
        this.selectBoard(null);

        this.boardService.delete(board).subscribe(r => {
          // Remove the Board from the array of Boards.
          // Then select a Board adjacent to the one that was deleted.
          const deletedBoardIndex = this.boardSet.boards.indexOf(board);
          this.boardSet.boards = this.boardSet.boards.filter(b => b !== board);

          // Try to select the next Board.
          if (this.boardSet.boards[deletedBoardIndex]) {
            this.selectBoard(this.boardSet.boards[deletedBoardIndex]);

          // Try to select the previous Board.
          } else if (this.boardSet.boards[deletedBoardIndex - 1]) {
            this.selectBoard(this.boardSet.boards[deletedBoardIndex - 1]);
          }
        });
      }

      this.currentDialogRef = undefined;
    });
  }

  deleteBoardSet(boardSet: BoardSet) {
    this.dialogService.deleteBoardSet(boardSet, {
      heading: `Delete '${boardSet.name}'? (contains ${boardSet.boards.length} Board${boardSet.boards.length !== 1 ? 's' : ''})`,
      content: `The Board Set and ${boardSet.boards.length} Board${boardSet.boards.length !== 1 ? 's' : ''} will be deleted. This cannot be undone.`,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.boardSetService.delete(boardSet).subscribe(r => this.router.navigate(['/', 'boardsets']));
      }
    });
  }

  editBoard(board: Board) {
    if (this.boardSet.readonly) { return; }
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardEditorDialogComponent, {
      width: '700px',
      data: { board: this.board }
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      this.currentDialogRef = undefined;
      this.boardService.update(board).subscribe();
    });

  }

  downloadBoard(board: Board) {
    saveAs(new Blob([JSON.stringify(board.toObf(), null, 2)], {type: 'text/plain;charset=utf-8'}), board.title + '.obf');
  }

  editBoardSet() {
    if (this.boardSet.readonly) { return; }
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardSetEditorDialogComponent, {
      width: '500px',
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

  uploadBoardObf() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ObfUploadDialogComponent, {
      width: '500px',
      data: { boardSet: this.boardSet }
    });

    this.currentDialogRef.afterClosed().subscribe(newBoard => {
      if (newBoard instanceof Board) {
        // Reload the BoardSet.
        this.getBoardSet().subscribe(bs => {
          // Select the new Board
          this.selectLastBoard();
        });
      }
      this.currentDialogRef = undefined;
    });
  }

  downloadBoardSetObz() {
    this.boardSetService.convertToObz(this.boardSet).then(content => saveAs(content, this.boardSet.title + '.obz'));
  }

  generatePdf() {
    this.updateBoardSet()
      .subscribe(r => this.router.navigate(['/', 'boardsets', this.boardSet.id, this.board.id, 'pdf']));
  }

  copyBoardSet() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(CopyBoardSetDialogComponent, {
      width: '300px',
      data: this.boardSet
    });

    this.currentDialogRef.afterClosed().subscribe(updatedBoardSet => {
      if (updatedBoardSet instanceof BoardSet) {
        // boardSet = updatedBoardSet;
        this.boardSetService.update(updatedBoardSet).subscribe();
      }

      this.currentDialogRef = undefined;
    });
  }

  copyLinkAG(singleBoards: boolean) {
    if (!this.boardSet.public) {
      this.snackBar.open('Board set must be public to generate link!', 'Close', { duration: 10000 });
      return;
    }
    let link = `${environment.astericsGridBase}/?gridset_provider=Global Symbols&gridset_id=${this.boardSet.id}&single_boards=${singleBoards}`;
    this.clipboard.copy(link);
    this.snackBar.open('Link copied to clipboard!', 'Close', { duration: 10000 });
  }

  refreshTree() {
    this.boardTree.rebuildTree();
  }
}
