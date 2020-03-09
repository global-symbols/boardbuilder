import {Deserialisable} from './deserialisable.model';
import * as uuid from 'uuid';
import {Board} from './board.model';
import {DatePipe} from '@angular/common';

export class BoardSet implements Deserialisable {
    public localId: number;
    public uuid: string;
    public title: string;
    public boards = Array<Board>();
    public createdAt: Date;

    constructor(init?: Partial<BoardSet>) {
      const pipe = new DatePipe('en-GB');
      this.title = 'Untitled Board Set ' + pipe.transform(Date.now(), 'mediumDate');
      this.uuid = uuid.v4();
      this.createdAt = new Date();

      Object.assign(this, init);

      this.addBoard();
    }

    deserialise(input: any): this {
      const object = Object.assign(this, input);
      this.boards = object.boards.map(board => new Board().deserialise(board));
      return this;
    }

    addBoard() {
        // Forces change detection by changing the Boards array reference.
        this.boards = this.boards.concat([new Board({ title: 'Board ' + (this.boards.length + 1) })]);
    }

    deleteBoard(board: Board) {
      this.boards = this.boards.filter(b => b !== board);
    }

  forceChangeDetect() {
    this.boards = this.boards.concat([]);
  }
}
