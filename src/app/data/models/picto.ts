import {Deserialisable} from './deserialisable.model';
import {Record} from '@data/models/record';


export class Picto extends Record implements Deserialisable {
  image_url: string;
  native_format: 'png' | 'svg' | 'jpg';
  part_of_speech: string;
  symbolset_id: number;
  adaptable?: boolean;

  constructor(init?: Partial<Picto>) {
    super();
    this.deserialise(init);
  }

  deserialise(input: Partial<Picto>): this {
    const object = Object.assign(this, input);
    return this;
  }
}
