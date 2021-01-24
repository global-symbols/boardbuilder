import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(@Inject(LOCALE_ID) public locale: string,
              private router: Router) { }

  currentLanguage() {
    return this.locale;
  }

  currentIso6391Language() {
    return this.locale.slice(0, 2);
  }

  availableLanguages() {
    return [
      {name: 'English', code: 'en-GB'},
      {name: 'French', code: 'fr'},
    ];
  }

  changeLanguage(code: string): void {
    window.location.href = '/' + code;
  }
}
