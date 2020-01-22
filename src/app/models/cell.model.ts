import {Deserialisable} from './deserialisable.model';

export class Cell implements Deserialisable {
    id: number;
    url?: string;
    width?: number;
    height?: number;
    content_type?: string;
    caption?: string;

    deserialise(input: any): this {
        return Object.assign(this, input);
    }
}
