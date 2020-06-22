import {Deserialisable} from '@data/models/deserialisable.model';
import {Record} from '@data/models/record';

export class Language extends Record implements Deserialisable {
  category: string;
  iso639_1: string;
  iso639_2b: string;
  iso639_2t: string;
  iso639_3: string;
  name: string;
  scope: string;

  deserialise(input: any): this {
    return Object.assign(this, input);
  }
}
