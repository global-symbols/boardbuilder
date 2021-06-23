import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {Router} from '@angular/router';

export interface Locale {
  name: string;
  code: string;
  iso639_1?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private router: Router
  ) { }

  currentLocale(): Locale {
    return this.availableLocales().find(l => l.code === this.locale);
  }

  availableLocales(): Locale[] {
    return [
      { name: 'English', code: 'en', iso639_1: 'en' },
      { name: 'French', code: 'fr', iso639_1: 'fr' },
    ];
  }

  changeLocale(code: string): void {
    window.location.href = '/' + code + this.router.url;
  }
}
