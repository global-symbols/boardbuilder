import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';
import {Record} from '@data/models/record';
import {Media} from '@data/models/media.model';

export class Cell extends Record implements Deserialisable {
    id: number;
    board_id: number;
    linked_board_id: number;
    media_id: number;
    board?: Board;
    media?: Media;
    linkable_boards?: Board[];
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
        if (object.media) { this.media = new Media().deserialise(object.media); }
        if (object.linkable_boards) { this.linkable_boards = input.linkable_boards.map(board => new Board().deserialise(board)); }
        return this;
    }

    get url(): string { return this.image_url; }
    set url(t) { this.image_url = t; }
}
