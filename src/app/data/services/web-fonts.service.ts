import {Injectable} from '@angular/core';
import {FontGroup, fonts} from '../web-safe-fonts';


@Injectable({
  providedIn: 'root'
})
export class WebFontsService {

  groupedByCategory(): Array<FontGroup> {
    return fonts;
  }

}
