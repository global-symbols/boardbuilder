import {Deserialisable} from '@data/models/deserialisable.model';
import {PageSize} from './page-size.model';

export class Template implements Deserialisable {

  name: string;

  pageSize: PageSize;
  orientation: 'portrait' | 'landscape';

  fontSize: number;

  deserialise(input: any): this {
    if (input.pageSize) { this.pageSize = new PageSize().deserialise(input.pageSize); }
    return Object.assign(this, input);
  }
}
