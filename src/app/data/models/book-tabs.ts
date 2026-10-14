// Book tab rules shared by the builder (and mirrored by the Rails book PDF, plan §6.4).

// Same palette as Tab Printer Settings.
export const BOOK_TAB_COLOURS = ['#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5', '#C45911', '#7030A0'];

// Tab width as a fraction of one cell width (D6).
export const BOOK_TAB_WIDTH_RATIO = 2 / 3;

// 0-based grid row of a page's tab: pages cycle down the rows, 1, 2, … rows, 1, 2 …
export function tabRow(pageIndex: number, rows: number): number {
  if (!(rows > 0) || pageIndex < 0) { return 0; }
  return pageIndex % rows;
}

// Tab background when the tab cell has none (D16): the palette colour for the page's position.
export function defaultTabColour(pageIndex: number): string {
  return BOOK_TAB_COLOURS[Math.max(pageIndex, 0) % BOOK_TAB_COLOURS.length];
}

// Black or white, whichever reads better on the background. Accepts hex or rgb()/rgba().
export function tabTextColour(background: string): string {
  const rgb = parseColour(background);
  if (!rgb) { return '#ffffff'; }
  const [r, g, b] = rgb;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#000000' : '#ffffff';
}

function parseColour(colour: string): [number, number, number] | null {
  if (!colour) { return null; }
  const rgb = colour.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) { return [+rgb[1], +rgb[2], +rgb[3]]; }
  const hex = colour.replace('#', '');
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) { return null; }
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}
