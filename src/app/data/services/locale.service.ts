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
      { iso639_1: 'en', code: 'en',     name: $localize`English` },
      { iso639_1: 'fr', code: 'sq',     name: $localize`Albanian` },
      { iso639_1: 'fr', code: 'ar',     name: $localize`Arabic` },
      { iso639_1: 'fr', code: 'hy',     name: $localize`Armenian` },
      { iso639_1: 'fr', code: 'bg',     name: $localize`Bulgarian` },
      { iso639_1: 'fr', code: 'ca',     name: $localize`Catalan` },
      { iso639_1: 'fr', code: 'hr',     name: $localize`Croatian` },
      { iso639_1: 'fr', code: 'nl',     name: $localize`Dutch` },
      { iso639_1: 'fr', code: 'fr',     name: $localize`French` },
      { iso639_1: 'fr', code: 'de',     name: $localize`German` },
      { iso639_1: 'fr', code: 'el',     name: $localize`Greek` },
      { iso639_1: 'fr', code: 'ro',     name: $localize`Romanian` },
      { iso639_1: 'sr', code: 'sr-cy',  name: $localize`Serbian (Cyrillic)` },
      { iso639_1: 'sr', code: 'sr-la',  name: $localize`Serbian (Latin)` },
      { iso639_1: 'es', code: 'es',     name: $localize`Spanish` },
      { iso639_1: 'tr', code: 'tr',     name: $localize`Turkish` },
      { iso639_1: 'ur', code: 'ur-pk',  name: $localize`Urdu (Pakistan)` },
    ].sort((a, b) => a.name < b.name ? -1 : 1);
  }

  changeLocale(code: string): void {
    window.location.href = '/' + code + this.router.url;
  }
}
