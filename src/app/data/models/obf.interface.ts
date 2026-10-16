export interface ObfButtonLoadBoard {
  name?: string;

  // BEGIN MUTUALLY EXCLUSIVE - use one only!
  id?: string;       // ID of the board to load, within an OBZ.
  data_url?: string; // URL of an OBF file to link to.
  url?: string;      // URL of a webpage to link to.
  path?: string;     // Path to OBF file to link to, within the OBZ. Usually 'boards/[id].obf'
  // END MUTUALLY EXCLUSIVE
}

export interface ObfButton {
  id: string;
  image_id: string;
  label: string;
  border_color?: string;
  background_color?: string;
  load_board?: ObfButtonLoadBoard;
}

export interface ObfGrid {
  rows: number;
  columns: number;
  order: string[][];
}

export interface ObfImage {
  id: string;

  // BEGIN MUTUALLY EXCLUSIVE - use one only!
  url?: string;  // For remote images
  data?: string; // For images stored directly in the JSON as base64.
  path?: string; // For images stored as separate files in an OBZ.
  // END MUTUALLY EXCLUSIVE

  width?: number;
  height?: number;
  content_type: string;
}

// Book fields (book/BOOK-OBZ-FORMAT.md §2–3). Apps that ignore ext_ fields see a normal board.
export interface ObfBookPage {
  role: 'page' | 'back_page';
  number?: number;         // pages: 1-based position in the book
  tab_row?: number;        // pages: 1-based tab row, for convenience
  type?: 'core_words' | 'conversation_support';  // back page only
}

// A page's tab, in OBF button shape. image_id points into the board's images.
export interface ObfBookTab {
  id: string;
  label: string;
  image_id?: string;
  background_color?: string;
  border_color?: string;
  text_color?: string;
}

export interface Obf {
  format: string;
  id: string;
  locale?: string;
  url?: string;
  name: string;
  description_html?: string;

  buttons: ObfButton[];

  grid: ObfGrid;

  images: ObfImage[];

  ext_globalsymbols_book_page?: ObfBookPage;
  ext_globalsymbols_book_tab?: ObfBookTab;
}
