import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {BoardSetService} from '../board-set.service';
import {Board} from '../models/board.model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {Cell} from '../models/cell.model';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit, OnDestroy {

  boardSet;
  board;
  selectedCell;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private service: BoardSetService,
              private hotkeysService: HotkeysService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Keyboard shortcut - delete Board
    this.hotkeysService.add(new Hotkey('meta+backspace', (event: KeyboardEvent): boolean => {
      this.deleteBoard(this.board);
      return false; // Prevent bubbling
    }));

    // Keyboard shortcut - add Board
    this.hotkeysService.add(new Hotkey('meta+enter', (event: KeyboardEvent): boolean => {
      this.addBoard();
      return false; // Prevent bubbling
    }));
  }

  ngOnInit() {
    this.getBoardSet();
  }

  private getBoardSet() {
    this.service.getBoardSet(1).then(bs => this.boardSet = bs);
  }

  addBoard() {
    this.boardSet.addBoard();
    this.updateBoardSet().then(bs => {
      this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
    });
  }

  updateBoardSet() {
    return this.service.updateBoardSet(this.boardSet).then(r => null);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  selectBoard(board?: Board) {
    this.board = board;
  }

  deleteBoard(board) {
    if (board === null) { return; }
    this.selectBoard(null);
    this.boardSet.boards = this.boardSet.boards.filter(b => b !== board);
    this.updateBoardSet().then(r => null);
    this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
  }

  selectCell(cell: Cell) {
    this.selectedCell = cell;
  }
}
