import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SymbolSearchResult} from '@data/models/symbol-search-result';
import {map} from 'rxjs/operators';
import {environment} from '@env';
import {Observable} from 'rxjs';
import {SearchSource} from '@data/services/global-symbols.service';

@Injectable({
  providedIn: 'root'
})
export class SymbolService {

  private apiBase = null;

  constructor(public http: HttpClient) {
    this.apiBase = environment.boardBuilderApiBase;
  }

  search(query, source: SearchSource): Observable<SymbolSearchResult[]> {

    if (source.key === 'open-symbols') {

      // Perform OpenSymbols searches directly.
      return this.http.get<any[]>('https://www.opensymbols.org/api/v1/symbols/search', { params: { q: query } })
        .pipe(map(arr => arr.map(result => new SymbolSearchResult().deserialise({
          id: result.id,
          label: result.name,
          tooltip: result.name,
          imageUrl: result.image_url
        }))));

    } else {

      // Perform all other searches through the BB API.
      return this.http.get<SymbolSearchResult[]>(this.apiBase + '/symbols/search', { params: { query, source: source.key } })
        .pipe(map(arr => arr.map(sr => new SymbolSearchResult().deserialise(sr))));
    }
  }
}
