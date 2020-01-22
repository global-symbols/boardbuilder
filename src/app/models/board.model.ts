import {Deserialisable} from './deserialisable.model';
import {Cell} from './cell.model';

export class Board implements Deserialisable {
    id: number;
    title: string;
    rows: number;
    columns: number;
    cells: Array<Cell>;

    constructor(init?: Partial<Board>) {
        this.rows = 3;
        this.columns = 4;
        this.title = 'New Board';


        Object.assign(this, init);

        this.cells = Array<Cell>();

        for (let i = 0; i < (this.rows * this.columns); i++) {
            const cell = new Cell();
            cell.id = i;
            this.cells.push(cell);
        }
    }

    deserialise(input: any): this {
        const object = Object.assign(this, input);
        object.cells.map(cell => new Cell().deserialise(cell));
        return object;
    }
}
