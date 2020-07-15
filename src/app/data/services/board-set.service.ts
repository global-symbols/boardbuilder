import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {BoardSet} from '@data/models/boardset.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BoardSetService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/board_sets`;

  constructor(private http: HttpClient) { }

  list(): Observable<BoardSet[]> {
    return this.http.get<BoardSet[]>(this.apiEndpoint)
      .pipe(map(arr => arr.map(item => new BoardSet().deserialise(item))));
  }

  get(id: number|string, expand = ''): Observable<BoardSet> {
    return this.http.get<BoardSet>(`${this.apiEndpoint}/${id}`, { params: { expand } })
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  add(record: BoardSet) {
    return this.http.post<BoardSet>(this.apiEndpoint, record)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  update(record: BoardSet) {
    return this.http.patch<BoardSet>(`${this.apiEndpoint}/${record.id}`, record)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  delete(record: BoardSet) {
    return this.http.delete<BoardSet>(`${this.apiEndpoint}/${record.id}`);
  }
}
