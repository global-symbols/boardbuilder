import {Deserialisable} from '@data/models/deserialisable.model';
import {PageSize} from './page-size.model';

export class Template implements Deserialisable {

  name: string;

  pageSize: PageSize;
  orientation: 'portrait' | 'landscape';

  fontSize: number;
  cellPadding: number;
  cellSpacing: number;
  drawCellBorders: boolean;
  cellBorderWidth: number;
  showHeader: boolean;
  imageTextSpacing: number;

  // Book pages only, for this print: tab row (1 = top) and whether the back page follows.
  tabRow?: number;
  includeBackPage?: boolean;

  deserialise(input: any): this {
    if (input.pageSize) { this.pageSize = new PageSize().deserialise(input.pageSize); }
    return Object.assign(this, input);
  }
}
