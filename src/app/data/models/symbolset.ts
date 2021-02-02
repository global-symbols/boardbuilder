import {Deserialisable} from '@data/models/deserialisable.model';
import {Licence} from '@data/models/licence';
import {Record} from '@data/models/record';

export class Symbolset extends Record implements Deserialisable {
  featured_level: number;
  licence: Licence;
  name: string;
  publisher: string;
  publisher_url: string;
  slug: string;
  status: string;

  deserialise(input: any): this {
    const object = Object.assign(this, input);
    this.licence = new Licence().deserialise(this.licence);
    return this;
  }
}
