import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

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

  searchLabels(query): Promise<object> {
    console.log(query);
    return this.http.get(this.apiBase + '/api/v1/labels/search', { params: query }).toPromise();
  }
}
