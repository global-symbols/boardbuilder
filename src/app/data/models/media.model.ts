import {Deserialisable} from './deserialisable.model';
import {Record} from '@data/models/record';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


export class Media extends Record implements Deserialisable {
  id: number;
  user_id: number;
  format: string;
  filesize: number;
  caption?: string;
  height: number;
  width: number;

  public_url: string;
  canvas_url?: string;

  safePublicUrl: SafeResourceUrl;

  constructor(init?: Partial<Media>) {
    super();
    this.deserialise(init);
  }

  deserialise(input: Partial<Media>): this {
    const object = Object.assign(this, input);
    return this;
  }
}
