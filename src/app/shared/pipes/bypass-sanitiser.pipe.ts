import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl} from '@angular/platform-browser';

@Pipe({
  name: 'bypassSanitiser'
})
export class BypassSanitiserPipe implements PipeTransform {

  constructor(protected sanitiser: DomSanitizer) {
  }

  transform(value: string, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitiser.bypassSecurityTrustHtml(value);
      case 'style':
        return this.sanitiser.bypassSecurityTrustStyle(value);
      case 'script':
        return this.sanitiser.bypassSecurityTrustScript(value);
      case 'url':
        return this.sanitiser.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this.sanitiser.bypassSecurityTrustResourceUrl(value);
      default:
        return this.sanitiser.bypassSecurityTrustHtml(value);
    }
  }

}
