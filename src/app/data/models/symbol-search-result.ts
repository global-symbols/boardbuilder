import {Deserialisable} from './deserialisable.model';
import {Picto} from '@data/models/picto';

export class SymbolSearchResult implements Deserialisable {

  id: string;
  label: string;
  tooltip: string;
  imageUrl: string;
  pictoId: number = null;
  picto?: Picto;

  deserialise(input: any): this {
    const object = Object.assign(this, input);
    return this;
  }
}
