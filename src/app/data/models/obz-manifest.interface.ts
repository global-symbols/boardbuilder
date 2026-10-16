export interface ObzBoards {
  [propName: string]: string;
}

export interface ObzPaths {
  boards: ObzBoards;
  images: ObzBoards;
  sounds: ObzBoards;
}

// Book settings in the manifest (book/BOOK-OBZ-FORMAT.md §1).
export interface ObzBook {
  format: string;            // 'book-0.1'
  producer: string;
  name: string;
  layout: { columns: number, rows: number };
  pages: string[];           // board ids in print order
  back_page: { id: string, type: 'core_words' | 'conversation_support' } | null;
  tabs: { edge: 'right', width_ratio: number, placement: 'row_cycle' };
  print: { back_page_after_each_page: boolean, mirror_back_page: boolean };
}

export interface ObzManifest {
  format: string;
  root: string;
  paths: ObzPaths;
  ext_globalsymbols_book?: ObzBook;
}
