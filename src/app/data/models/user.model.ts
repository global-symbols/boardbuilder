import {Record} from './record';
import {Deserialisable} from './deserialisable.model';

export class User extends Record implements Deserialisable {

  prename: string;
  surname: string;

  deserialise(input: Partial<User>): this {
    const object = Object.assign(this, input);
    return this;
  }
}
