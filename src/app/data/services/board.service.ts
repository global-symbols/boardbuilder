import { Injectable } from '@angular/core';
import {environment} from '@env';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Board} from '@data/models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/boards`;

  constructor(private http: HttpClient) { }

  list(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiEndpoint)
      .pipe(map(arr => arr.map(item => new Board().deserialise(item))));
  }

  get(id: number|string, expand = ''): Observable<Board> {
    return this.http.get<Board>(`${this.apiEndpoint}/${id}`, { params: { expand } })
      .pipe(map(data => new Board().deserialise(data)));
  }

  add(record: Board) {
    return this.http.post<Board>(this.apiEndpoint, record)
      .pipe(map(data => new Board().deserialise(data)));
  }

  update(record: Board) {
    return this.http.patch<Board>(`${this.apiEndpoint}/${record.id}`, record)
      .pipe(map(data => new Board().deserialise(data)));
  }

  delete(record: Board) {
    return this.http.delete<Board>(`${this.apiEndpoint}/${record.id}`);
  }

  reorderCells(board: Board) {
    const newOrder = board.cells.map(t => t.id);
    // console.log(newOrder);
    return this.http.patch<Board>(`${this.apiEndpoint}/${board.id}/reorder_cells`, { cell_ids: newOrder});
  }
}
