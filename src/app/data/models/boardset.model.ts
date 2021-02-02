import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';
import {Record} from '@data/models/record';
import {Cell} from '@data/models/cell.model';
import {User} from '@data/models/user.model';

export class BoardSet extends Record implements Deserialisable {
    public localId: number;
    public name: string;
    public public: boolean;
    public readonly: boolean;
    public boards = Array<Board>();
    opened_at: Date;
    preview_cells: Array<Cell>;

    owner?: User;


    constructor(init?: Partial<BoardSet>) {
      super();
      this.deserialise(init);
    }

    deserialise(input: Partial<BoardSet>): this {
      const object = Object.assign(this, input);
      if (object.boards) { this.boards = object.boards.map(board => new Board().deserialise(board)); }
      if (object.preview_cells) { this.preview_cells = object.preview_cells.map(c => new Cell().deserialise(c)); }
      if (object.owner) { this.owner = new User().deserialise(object.owner); }
      return this;
    }

    addBoard() {
        // Forces change detection by changing the Boards array reference.
        this.boards = this.boards.concat([new Board({ title: 'Board ' + (this.boards.length + 1) })]);
    }

    deleteBoard(board: Board) {
      this.boards = this.boards.filter(b => b !== board);
    }

    get title(): string { return this.name; }
    set title(t) { this.name = t; }

}
