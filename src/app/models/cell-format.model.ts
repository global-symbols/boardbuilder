import {Deserialisable} from './deserialisable.model';

export class CellFormat implements Deserialisable {

  backgroundColour: string;
  borderColour: string;
  textColour: string;
  labelPosition: string;

  constructor() {
    this.labelPosition = 'bottom';
  }

  deserialise(input: any): this {
    return Object.assign(this, input);
  }
}
