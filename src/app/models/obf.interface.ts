export interface ObfButton {
  id: string;
  image_id: string;
  label: string;
  border_color?: string;
  background_color?: string;
}

export interface ObfGrid {
  rows: number;
  columns: number;
  order: string[];
}

export interface ObfImage {
  id: string;
  url: string;
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
