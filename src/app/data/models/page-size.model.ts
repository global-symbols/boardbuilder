import {Deserialisable} from '@data/models/deserialisable.model';

export class PageSize implements Deserialisable {
  name: string;

  x: number;
  y: number;

  constructor(init?: Partial<PageSize>) {
    if (init) { this.deserialise(init); }
  }

  deserialise(input: any): this {
    Object.assign(this, input);

    return this;
  }

  get shortEdge(): number {
    return Math.min.apply(Math, [this.x, this.y]);
  }

  get longEdge(): number {
    return Math.max.apply(Math, [this.x, this.y]);
  }

  get ratio(): number {
    return this.longEdge / this.shortEdge;
  }
}
