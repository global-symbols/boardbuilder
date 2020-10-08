export interface FontGroup {
  name: string;
  fonts: Array<string>;
}

export const fonts: Array<FontGroup> = [
  {
    name: 'sans-serif',
    fonts: [
      'Arial',
      'Calibri',
      'Century Gothic',
      'Tahoma',
      'Trebuchet MS',
      'Verdana'
    ]
  },
  {
    name: 'serif',
    fonts: [
      'Book Antiqua',
      'Cambria',
      'Garamond',
      'Georgia',
      'Goudy Old Style',
      'Lucida Bright',
      'Palatino',
      'Baskerville',
      'Times New Roman'
    ]
  },
  {
    name: 'monospace',
    fonts: [
      'Courier New',
      'Lucida Sans Typewriter'
    ]
  }
];
