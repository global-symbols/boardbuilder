import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {SymbolSearchResult} from '../models/symbol-search-result';
import {map} from 'rxjs/operators';
import {Symbolset} from '@data/models/symbolset';
import {Observable} from 'rxjs';
import {Language} from '@data/models/language';

export interface SearchSource {
  key: 'gs' | 'open-symbols' | 'the-noun-project';
  name: string;
  fixCors: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalSymbolsService {

  private apiBase = null;

  public readonly sources: SearchSource[]  = [
    {
      key: 'gs',
      name: 'Global Symbols',
      fixCors: false
    }, {
      key: 'open-symbols',
      name: 'Open Symbols',
      fixCors: true
    }, {
      key: 'the-noun-project',
      name: 'The Noun Project',
      fixCors: true
    },
  ];

  constructor(public http: HttpClient) {
    this.apiBase = environment.globalSymbolsApiBase;
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.apiBase + '/languages/active')
      .pipe(map(arr => arr.map(record => new Language().deserialise(record))));
  }

  getSymbolSets(): Observable<Symbolset[]> {
    return this.http.get<Symbolset[]>(this.apiBase + '/symbolsets')
      .pipe(map(arr => arr.map(record => new Symbolset().deserialise(record))));
  }

  search(query): Promise<SymbolSearchResult[]> {
    return this.http
      .get(this.apiBase + '/labels/search', { params: query }).pipe(
      map(response => {
        return this.parseResult(response);
      })
    ).toPromise();
  }

  parseResult(results): SymbolSearchResult[] {
    const adaptableTooltip = $localize`:search result custom colour supported|:(supports custom colours)`;
    return results.map(result => new SymbolSearchResult().deserialise({
      id: result.id,
      label: result.text,
      tooltip: $localize`${result.text}:symbolLabel: in ${result.picto.symbolset?.name}:symbolsetName:${result.picto?.adaptable ? ' ' + adaptableTooltip : ''}:adaptableSuffix:`,
      imageUrl: result.picto.image_url,
      pictoId: result.picto.id,
      picto: result.picto
    }));
  }
}

