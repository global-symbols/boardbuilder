import {Deserialisable} from './deserialisable.model';
import {Cell} from './cell.model';
import {CellFormat} from './cell-format.model';

export class Board implements Deserialisable {
    id: number;
    title: string;
    rows: number;
    columns: number;
    cells: Array<Cell>;
    defaultCellFormat: CellFormat;

    constructor(init?: Partial<Board>) {
        this.rows = 3;
        this.columns = 4;
        this.title = 'New Board';

        this.defaultCellFormat = new CellFormat();

        Object.assign(this, init);

        this.cells = Array<Cell>();

        this.populateCells();
    }

    deserialise(input: any): this {
      const object = Object.assign(this, input);
      this.cells = object.cells.map(cell => new Cell().deserialise(cell));
      return this;
    }

    populateCells(): void {
      for (let i = this.cells.length; i < (this.rows * this.columns); i++) {
        const cell = new Cell();
        cell.id = i;
        this.cells.push(cell);
      }
    }
}
