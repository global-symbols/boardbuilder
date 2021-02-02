import {Injectable} from '@angular/core';
import {environment} from '@env';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Cell} from '@data/models/cell.model';

@Injectable({
  providedIn: 'root'
})
export class CellService {
  private apiEndpoint = `${environment.boardBuilderApiBase}/cells`;

  constructor(private http: HttpClient) { }

  list(): Observable<Cell[]> {
    return this.http.get<Cell[]>(this.apiEndpoint)
      .pipe(map(arr => arr.map(item => new Cell().deserialise(item))));
  }

  get(id: number|string, expand = ''): Observable<Cell> {
    return this.http.get<Cell>(`${this.apiEndpoint}/${id}`, { params: { expand } })
      .pipe(map(data => new Cell().deserialise(data)));
  }

  update(record: Cell) {
    return this.http.patch<Cell>(`${this.apiEndpoint}/${record.id}`, record)
      .pipe(map(data => new Cell().deserialise(data)));
  }
}
