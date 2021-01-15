import {Deserialisable} from '@data/models/deserialisable.model';

export class PageSize implements Deserialisable {
  name: string;

  x: number;
  y: number;

  deserialise(input: any): this {
    return Object.assign(this, input);
  }
}
