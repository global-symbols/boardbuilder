import {Deserialisable} from './deserialisable.model';
import * as uuid from 'uuid';
import {Board} from './board.model';

export class BoardSet implements Deserialisable {
    public uuid: string;
    public title: string;
    public boards = Array<Board>();

    constructor() {
        this.title = 'Untitled Board Set';
        this.uuid = uuid.v4();
        this.addBoard();
    }

    deserialise(input: any): this {
        const object = Object.assign(this, input);
        object.boards.map(board => new Board().deserialise(board));
        return object;
    }

    addBoard() {
        this.boards.push(new Board());
    }

}
