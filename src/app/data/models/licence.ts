import {Deserialisable} from '@data/models/deserialisable.model';

export class Licence implements Deserialisable {
  name: string;
  properties: string;
  url: string;
  version: string;

  deserialise(input: any): this {
    return Object.assign(this, input);
  }
}
