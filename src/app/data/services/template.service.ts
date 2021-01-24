import {Injectable} from '@angular/core';
import {environment} from '@env';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PageSize} from '@data/models/page-size.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/templates`;

  constructor(private http: HttpClient) { }

  pageSizes(): Observable<PageSize[]> {
    return this.http.get<PageSize[]>(`${this.apiEndpoint}/page_sizes`)
      .pipe(map(arr => arr.map(item => new PageSize().deserialise(item))));
  }
}
