import {BOOK_TAB_COLOURS, defaultTabColour, tabRow, tabTextColour} from './book-tabs';

describe('book tabs', () => {
  it('cycles a 4-row book through rows 1, 2, 3, 4, 1, 2, 3', () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(page => tabRow(page, 4) + 1)).toEqual([1, 2, 3, 4, 1, 2, 3]);
  });

  it('wraps a 6-row book after six pages', () => {
    expect([0, 5, 6, 7, 12].map(page => tabRow(page, 6) + 1)).toEqual([1, 6, 1, 2, 1]);
  });

  it('uses row 1 when the page is unknown', () => {
    expect(tabRow(-1, 4)).toBe(0);
    expect(tabRow(3, 0)).toBe(0);
  });

  it('picks the default colour by page order from the colour picker\'s lighter row', () => {
    expect(BOOK_TAB_COLOURS).toEqual(['#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB']);
    expect(defaultTabColour(0)).toBe('#EB9694');
    expect(defaultTabColour(1)).toBe('#FAD0C3');
    expect(defaultTabColour(BOOK_TAB_COLOURS.length)).toBe('#EB9694');
  });

  it('puts black text on every default (light) tab colour', () => {
    BOOK_TAB_COLOURS.forEach(colour => expect(tabTextColour(colour)).toBe('#000000'));
  });

  it('chooses readable text for hex and rgb() backgrounds', () => {
    expect(tabTextColour('#4472C4')).toBe('#ffffff');
    expect(tabTextColour('#FFC000')).toBe('#000000');
    expect(tabTextColour('rgb(255, 255, 255)')).toBe('#000000');
    expect(tabTextColour('not a colour')).toBe('#ffffff');
  });
});
