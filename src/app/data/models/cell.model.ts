import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';

export class Cell implements Deserialisable {
    id: number;
    board_id: number;
    image_url?: string;
    imageData?: string;
    width?: number;
    board?: Board;
    caption?: string;
    backgroundColour: string;
    borderColour: string;
    textColour: string;

    deserialise(input: any): this {
        const object = Object.assign(this, input);
        if (object.board) { this.board = new Board().deserialise(object.board); }
        return this;
    }

    get url(): string { return this.image_url; }
    set url(t) { this.image_url = t; }
}
