import {Deserialisable} from './deserialisable.model';

export class SymbolSearchResult implements Deserialisable {

  id: string;
  label: string;
  imageUrl: string;
  pictoId: number = null;

  deserialise(input: any): this {
    const object = Object.assign(this, input);
    return this;
  }
}
