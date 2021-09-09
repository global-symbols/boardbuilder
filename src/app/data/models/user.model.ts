import {Record} from './record';
import {Deserialisable} from './deserialisable.model';

export class User extends Record implements Deserialisable {

  prename: string;
  surname: string;
  default_hair_colour: string;
  default_skin_colour: string;

  deserialise(input: Partial<User>): this {
    const object = Object.assign(this, input);
    return this;
  }
}
