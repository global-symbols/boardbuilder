import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';
import {Record} from '@data/models/record';

export class Cell extends Record implements Deserialisable {
    id: number;
    board_id: number;
    board?: Board;
    image_url?: string;
    imageData?: string;
    width?: number;
    caption?: string;
    background_colour: string;
    border_colour: string;
    text_colour: string;

    constructor(init?: Partial<Cell>) {
      super();
      this.deserialise(init);
    }

    deserialise(input: Partial<Cell>): this {
        const object = Object.assign(this, input);
        if (object.board) { this.board = new Board().deserialise(object.board); }
        return this;
    }

    get url(): string { return this.image_url; }
    set url(t) { this.image_url = t; }
}
