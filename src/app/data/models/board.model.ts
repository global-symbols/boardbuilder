import {Deserialisable} from './deserialisable.model';
import {Cell} from './cell.model';
import * as uuid from 'uuid';
import * as mime from 'mime/lite';
import {CellFormat} from './cell-format.model';
import {Obf} from './obf.interface';

export class Board implements Deserialisable {
  id: number;
  board_set_id: number;
  uuid: string;
  name: string;
  rows: number;
  columns: number;
  cells: Array<Cell>;
  captions_position: string;
  defaultCellFormat: CellFormat;

  constructor(init?: Partial<Board>) {
      this.rows = 3;
      this.columns = 4;
      this.name = 'New Board';
      this.uuid = uuid.v4();
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

  childBoards(): Array<Board> {
    const out = [];
    this.cells.forEach(c => {
      if (c.board) { out.push(c.board); }
    });
    return out;
  }

  toObf(): Obf {

    // Chunk the Cells according to the number of rows/cols
    const gridOrderMatrix = [];
    for (let i = 0; i < this.cells.length; i += this.columns) {
      // Chop out the right number of Cells
      const chunk = this.cells.slice(i, i + this.columns);

      // Replace each Cell with a unique identifier.
      gridOrderMatrix.push(chunk.map((cell, index) => this.uuid + cell.id));
    }

    const obf: Obf = {
      format: 'open-board-0.1',
      id: this.uuid,
      locale: 'en',
      name: this.title,
      buttons: this.cells.map((cell, index) => ({
        id: this.uuid + index,
        image_id: this.uuid + index,
        label: cell.caption,
        border_color: cell.border_colour,
        background_color: cell.background_colour
      })),
      grid: {
        rows: this.rows,
        columns: this.columns,
        order: gridOrderMatrix
      },
      images: this.cells.map((cell, index) => ({
        id: this.uuid + cell.id,
        url: cell.image_url,
        content_type: mime.getType(cell.image_url)
      }))
    };

    return obf;
  }

  fromObf(obf: any): boolean {
    this.rows = obf.grid.rows;
    this.columns = obf.grid.columns;
    this.title = obf.name;
    this.populateCells();

    // OBF grid.order is a matrix, so we flatten it to get the cells in sequential order.
    obf.grid.order.flat().forEach((cellId, i) => {
      const obfButton = obf.buttons.find(button => button.id === cellId);
      const obfImage = obf.images.find(image => image.id === obfButton.image_id);

      if (obfButton) {
        this.cells[i].caption = obfButton.label;
        this.cells[i].borderColour = obfButton.border_color;
        this.cells[i].backgroundColour = obfButton.background_color;
      }

      if (obfImage) {
        if (obfImage.url) { this.cells[i].url = obfImage.url; }
        if (obfImage.data) { this.cells[i].imageData = obfImage.data; }
      }
    });
    return true;
  }

  cellsAsMatrix() {
    return this.cells.slice(0, this.rows * this.columns).reduce((rows, key, index) => (index % this.columns === 0 ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows, []);
  }

  get title(): string { return this.name; }
  set title(t) { this.name = t; }
}
