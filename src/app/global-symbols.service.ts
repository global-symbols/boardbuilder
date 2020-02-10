import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {SymbolSearchResult} from './models/symbol-search-result.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalSymbolsService {

  private apiBase = null;

  constructor(public http: HttpClient) {
    this.apiBase = environment.globalSymbolsBase;
  }

  searchParameters(): Array<object> {
    return [{
      key: 'query',
      type: 'text'
    }, {
      key: 'symbolset',
      type: 'select',
      options: this.getSymbolSets()
    }, {
      key: 'language',
      type: 'select',
      options: this.getLanguages()
    }];
  }

  getLanguages(): Promise<object> {
    return this.http.get(this.apiBase + '/api/v1/languages/active').toPromise();
  }

  getSymbolSets(): Promise<object> {
    return this.http.get(this.apiBase + '/api/v1/symbolsets').toPromise();
  }

  searchConcepts(query): Promise<object> {
    return this.http.get(this.apiBase + '/api/v1/concepts/suggest', {
      params: { query }
    }).toPromise();
  }

  search(query): Promise<SymbolSearchResult[]> {
    return this.http.get(this.apiBase + '/api/v1/labels/search', { params: query }).pipe(
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

