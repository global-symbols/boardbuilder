import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';

export class Cell implements Deserialisable {
    id: number;
    url?: string;
    width?: number;
    height?: number;
    contentType?: string;
    linkToBoardId?: string;
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
}
