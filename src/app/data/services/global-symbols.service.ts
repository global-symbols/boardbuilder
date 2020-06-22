import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {SymbolSearchResult} from '../models/symbol-search-result';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalSymbolsService {

  private apiBase = null;

  constructor(public http: HttpClient) {
    this.apiBase = environment.globalSymbolsApiBase;
  }

  getLanguages(): Promise<object> {
    return this.http.get(this.apiBase + '/languages/active').toPromise();
  }

  getSymbolSets(): Promise<object> {
    return this.http.get(this.apiBase + '/symbolsets').toPromise();
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
    return results.map(result => new SymbolSearchResult().deserialise({
      id: result.id,
      label: result.text,
      imageUrl: result.picto.image_url
    }));
  }
}

