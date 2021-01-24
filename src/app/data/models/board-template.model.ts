import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';

export class BoardTemplate implements Deserialisable {

  board: Board;
  name: string;

  deserialise(input: Partial<BoardTemplate>): this {
    const object = Object.assign(this, input);
    if (input.board) { this.board = new Board().deserialise(input.board); }
    return this;
  }

  get description(): string {

    const columnsLabel = this.board.columns > 1 ? 'columns' : 'column';
    const rowsLabel = this.board.rows > 1 ? 'rows' : 'row';

    let captionsLabel = 'no captions';

    if (['left', 'right'].includes(this.board.captions_position)) {
      captionsLabel = `captions on the ${this.board.captions_position}`;

    } else if (['above', 'below'].includes(this.board.captions_position)) {
      captionsLabel = `captions ${this.board.captions_position}`;
    }

    return `${this.board.columns} ${columnsLabel}, ${this.board.rows} ${rowsLabel}, ${captionsLabel}`;
  }

  get slug(): string {
    return `${this.board.columns}x${this.board.rows}-captions-${this.board.captions_position}`;
  }
}
