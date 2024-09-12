import {Deserialisable} from './deserialisable.model';
import {Cell} from './cell.model';
import * as mime from 'mime/lite';
import {Obf} from './obf.interface';
import {Record} from '@data/models/record';
import {BoardTemplate} from '@data/models/board-template.model';
import {Media} from '@data/models/media.model';

export class Board extends Record implements Deserialisable {
  board_set_id: number;
  header_media_id: number;
  name: string;
  description: string;
  rows: number;
  columns: number;
  cells: Array<Cell>;
  captions_position: 'hidden' | 'above' | 'below' | 'left' | 'right';
  header_media: Media;

  constructor(init?: Partial<Board>) {
      super();
      this.cells = new Array<Cell>();
      if (init) { this.deserialise(init); }
      this.populateCells();
  }

  deserialise(input: Partial<Board>): this {
    const object = Object.assign(this, input);
    if (input.cells) { this.cells = input.cells.map(cell => new Cell().deserialise(cell)); }
    return this;
  }

  populateCells(): void {
    for (let i = this.cells.length; i < (this.rows * this.columns); i++) {
      this.cells.push(new Cell());
    }
    this.cells = this.cells.slice(0, this.rows * this.columns);
  }

  setDimensions(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.populateCells();
  }

  childBoards(): Array<Board> {
    const out = [];
    this.cells.forEach(c => {
      if (c.board) { out.push(c.board); }
    });
    return out;
  }



  toObf(): Obf {

    // Returns a string that identifies and connects Cell/Image/Button items in the OBF
    const cellId = cell => this.id.toString() + cell.id.toString();

    // Chunk the Cells according to the number of rows/cols
    const gridOrderMatrix = [];
    for (let i = 0; i < this.cells.length; i += this.columns) {
      // Chop out the right number of Cells
      const chunk = this.cells.slice(i, i + this.columns);

      // Replace each Cell with a unique identifier.
      gridOrderMatrix.push(chunk.map((cell, index) => cellId(cell) ));
    }

    const obf: Obf = {
      format: 'open-board-0.1',
      id: this.id.toString(),
      locale: 'en',
      name: this.title,
      buttons: this.cells.map((cell, index) => ({
        id: cellId(cell),
        image_id: cellId(cell),
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
        id: cellId(cell),
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

      // If the cell ID is not null (CBoard OBFs have null cell IDs on unused cells).
      if (cellId != null) {
        const obfButton = obf.buttons.find(button => button.id === cellId);
        const obfImage = obf.images.find(image => image.id === obfButton.image_id);

        if (obfButton) {
          this.cells[i].caption = obfButton.label;
          this.cells[i].border_colour = obfButton.border_color;
          this.cells[i].background_colour = obfButton.background_color;
        }

        if (obfImage) {
          if (obfImage.url) {
            this.cells[i].image_url = obfImage.url;
          } else if (obfImage.data) {
            this.cells[i].imageData = obfImage.data;
          }
          // TODO: Restore embedded imagedata OBFs
          // if (obfImage.data) { this.cells[i].imageData = obfImage.data; }
        }
      }

    });
    return true;
  }

  cellsAsMatrix() {
    return this.cells.slice(0, this.rows * this.columns).reduce((rows, key, index) => (index % this.columns === 0 ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows, []);
  }

  matchesTemplate(template: BoardTemplate) {
    return (
      this.rows === template.board.rows
      && this.columns === template.board.columns
      && this.captions_position === template.board.captions_position
    );
  }

  get title(): string { return this.name; }
  set title(t) { this.name = t; }

  get cellLayout(): 'column' | 'row' {
    return ['above', 'below', 'hidden'].includes(this.captions_position) ? 'column' : 'row';
  }

  // Return the number of logical columns.
  // When captions are to be placed to the left/right of the image, this effectively doubles the width of each Cell.
  // Hence, the logical number of columns would be double the actual number.
  // Used for calculating whether pages should be portrait or landscape.
  get logicalColumns(): number {
    return ['left', 'right'].includes(this.captions_position) ? this.columns * 2 : this.columns;
  }
}
