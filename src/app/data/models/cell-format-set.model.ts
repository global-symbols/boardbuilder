import {Deserialisable} from './deserialisable.model';
import {CellFormat} from './cell-format.model';

export class CellFormatSet implements Deserialisable {

  name: string;
  cellFormats: Array<CellFormat>;

  constructor(init?: Partial<CellFormatSet>) {

    Object.assign(this, init);
    this.cellFormats = Array<CellFormat>();
  }

  deserialise(input: any): this {
    const object = Object.assign(this, input);
    this.cellFormats = object.cellFormats.map(cell => new CellFormat().deserialise(cell));
    return this;
  }
}
