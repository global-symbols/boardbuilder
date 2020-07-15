import {Deserialisable} from './deserialisable.model';
import * as uuid from 'uuid';
import {Board} from './board.model';
import {DatePipe} from '@angular/common';
import {Record} from '@data/models/record';

export class BoardSet extends Record implements Deserialisable {
    public localId: number;
    public uuid: string;
    public name: string;
    public boards = Array<Board>();
    public createdAt: Date;
    public updatedAt: Date;

    constructor(init?: Partial<BoardSet>) {
      super();
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

    // Finds a Board within this BoardSet by the UUID.
    // Recurses to search Boards nested within the Cells of other Boards.
    findBoard(searchUuid: string, boards: Board[] = this.boards): Board {

      if (boards.length === 0) { return null; }

      for (const board of boards) {
        if (board.uuid === searchUuid) { return board; }

        const b = this.findBoard(searchUuid, board.cells.filter(c => c.board !== undefined).map(c => c.board));
        if (b instanceof Board) { return b; }
      }

      return null;
    }

    get title(): string { return this.name; }
    set title(t) { this.name = t; }

}
