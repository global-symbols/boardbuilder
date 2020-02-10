import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SymbolSearchResult} from './models/symbol-search-result.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenSymbolsService {

  constructor(public http: HttpClient) { }

  // searchLabels(query: string): Promise<object> {
  //   return this.http.get('https://www.opensymbols.org/api/v1/symbols/search', { params: { q: query } })
  //     .toPromise()
  //     .then(results => {
  //       return results.map(r => r = new SymbolSearchResult().deserialise({
  //         id: r.id,
  //         label: r.name,
  //         imageUrl: r.image_url
  //       }));
  //     });
  // }



  search(query): Promise<SymbolSearchResult[]> {
    return this.http.get('https://www.opensymbols.org/api/v1/symbols/search', { params: { q: query } }).pipe(
      map(response => {
        return this.parseResult(response);
      })
    ).toPromise();
  }

  parseResult(results): SymbolSearchResult[] {
    return results.map(result => new SymbolSearchResult().deserialise({
      id: result.id,
      label: result.name,
      imageUrl: result.image_url
    }));
  }
}
