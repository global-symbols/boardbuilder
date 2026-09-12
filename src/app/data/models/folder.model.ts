import {Deserialisable} from './deserialisable.model';
import {Record} from '@data/models/record';

export class Folder extends Record implements Deserialisable {
  name: string;
  position: number;
  board_sets_count: number;

  constructor(init?: Partial<Folder>) {
    super();
    this.deserialise(init);
  }

  deserialise(input: Partial<Folder>): this {
    return Object.assign(this, input);
  }
}
