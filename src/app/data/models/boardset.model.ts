import {Deserialisable} from './deserialisable.model';
import {Board} from './board.model';
import {Record} from '@data/models/record';
import {Cell} from '@data/models/cell.model';
import {User} from '@data/models/user.model';
import {CatalogueTab} from '@data/models/catalogue-tab.model';

export type BoardSetKind = 'board_set' | 'book';

// Book layouts offered when creating a book: 12 cells (3 × 4) and 36 cells (6 × 6).
export const BOOK_LAYOUTS: ReadonlyArray<{ columns: number, rows: number }> = [
  { columns: 3, rows: 4 },
  { columns: 6, rows: 6 }
];

export class BoardSet extends Record implements Deserialisable {
    public localId: number;
    public name: string;
    public description: string;
    public tags: string[];
    public lang: string;
    public author: string;
    public author_url: string;
    public self_contained: boolean;
    public public: boolean;
    public readonly: boolean;
    public folder_id: number;
    public catalogue_tabs: boolean;
    public tab_edge: 'top' | 'bottom' | 'left' | 'right';
    // A book is a board set with a fixed layout, ordered pages, an optional back page and a tab per page.
    public kind: BoardSetKind = 'board_set';
    public book_columns?: number;
    public book_rows?: number;
    public tabs: CatalogueTab[] = [];
    public translated?: number;
    // Messages for the person importing an OBZ (e.g. boards skipped). Not saved.
    public importNotes?: string[];
    public skipped?: number;
    public boards = Array<Board>();
    opened_at: Date;
    preview_cells: Array<Cell>;

    owner?: User;


    constructor(init?: Partial<BoardSet>) {
      super();
      this.deserialise(init);
    }

    deserialise(input: Partial<BoardSet>): this {
      const object = Object.assign(this, input);
      if (object.boards) { this.boards = object.boards.map(board => new Board().deserialise(board)); }
      if (object.tabs) {
        this.tabs = object.tabs.map(tab => ({
          id: tab.id,
          label: tab.label,
          colour: tab.colour,
          image_url: tab.image_url,
          position: tab.position,
          board_ids: tab.board_ids ? tab.board_ids.slice() : []
        }));
      }
      if (object.preview_cells) { this.preview_cells = object.preview_cells.map(c => new Cell().deserialise(c)); }
      if (object.owner) { this.owner = new User().deserialise(object.owner); }
      return this;
    }

    addBoard() {
        // Forces change detection by changing the Boards array reference.
        this.boards = this.boards.concat([new Board({ title: 'Board ' + (this.boards.length + 1) })]);
    }

    deleteBoard(board: Board) {
      this.boards = this.boards.filter(b => b !== board);
    }

    get title(): string { return this.name; }
    set title(t) { this.name = t; }

    get isBook(): boolean { return this.kind === 'book'; }

    // Cells per book page, e.g. 12 or 36.
    get bookCellCount(): number { return this.isBook ? this.book_columns * this.book_rows : null; }

    // Book pages in print order. The back page is not a page.
    get pages(): Board[] {
      return this.boards
        .filter(board => board.role !== 'back_page')
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0) || (a.id ?? 0) - (b.id ?? 0));
    }

    get backPage(): Board | undefined {
      return this.boards.find(board => board.role === 'back_page');
    }

}
