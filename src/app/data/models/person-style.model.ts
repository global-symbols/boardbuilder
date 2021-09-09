import {Deserialisable} from './deserialisable.model';


export class PersonStyle implements Deserialisable {

  hair: string;
  skin: string;

  constructor(init?: Partial<PersonStyle>) {
    this.deserialise(init);
  }

  deserialise(input: Partial<PersonStyle>): this {
    return Object.assign(this, input);
  }
}
