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
      { code: 'en', iso639_1: 'en', name: 'English' },
      { code: 'sq', iso639_1: 'fr', name: 'Albanian' },
      { code: 'ar', iso639_1: 'fr', name: 'Arabic' },
      { code: 'hy', iso639_1: 'fr', name: 'Armenian' },
      { code: 'bg', iso639_1: 'fr', name: 'Bulgarian' },
      { code: 'ca', iso639_1: 'fr', name: 'Catalan' },
      { code: 'hr', iso639_1: 'fr', name: 'Croatian' },
      { code: 'nl', iso639_1: 'fr', name: 'Dutch' },
      { code: 'fr', iso639_1: 'fr', name: 'French' },
      { code: 'de', iso639_1: 'fr', name: 'German' },
      { code: 'el', iso639_1: 'fr', name: 'Greek' },
      { code: 'ro', iso639_1: 'fr', name: 'Romanian' },
      { code: 'sr-cy', iso639_1: 'sr', name: 'Serbian (Cyrillic)' },
      { code: 'sr-la', iso639_1: 'sr', name: 'Serbian (Latin)' },
      { code: 'es', iso639_1: 'es', name: 'Spanish' },
      { code: 'tr', iso639_1: 'tr', name: 'Turkish' },
      { code: 'ur-pk', iso639_1: 'ur', name: 'Urdu (Pakistan)' },
    ].sort((a, b) => a.name < b.name ? -1 : 1);
  }

  changeLocale(code: string): void {
    window.location.href = '/' + code + this.router.url;
  }
}
