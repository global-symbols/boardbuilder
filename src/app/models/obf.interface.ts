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
}
