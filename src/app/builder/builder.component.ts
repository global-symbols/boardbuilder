import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {BoardSetService} from '../board-set.service';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit, OnDestroy {

  boardSet;
  board;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private service: BoardSetService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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
    this.selectBoard(null);
    this.boardSet.boards = this.boardSet.boards.filter(b => b !== board);
    this.updateBoardSet();
  }
}
