import {Injectable, SecurityContext} from '@angular/core';
import {environment} from '@env';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Board} from '@data/models/board.model';
import {Obf} from '@data/models/obf.interface';
import {BoardSet} from '@data/models/boardset.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ImageBase64Service} from '@data/services/image-base64.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/boards`;

  constructor(private http: HttpClient,
              private sanitizer: DomSanitizer,
              private base64Service: ImageBase64Service
  ) { }

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
    return this.http.patch<Board>(`${this.apiEndpoint}/${board.id}/reorder_cells`, { cell_ids: newOrder});
  }

  public addFromObf(obf: Obf, boardSet: BoardSet): Observable<Board> {
    return this.http.post<Board>(`${this.apiEndpoint}/obf`, {obf, board_set_id: boardSet.id})
      .pipe(map(data => new Board().deserialise(data)));
  }

  pdf(id: number|string): Promise<string | ArrayBuffer> {
    return this.base64Service.getFromURL(`${this.apiEndpoint}/${id}/pdf`);
    // return this.http.get(`${this.apiEndpoint}/${id}/pdf`);
  }

  pdfUrl(id: number|string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${this.apiEndpoint}/${id}/pdf?bearer_token=4bRCZJa1nyCNhNsM2irYdjn3I-xF6YSAWb_bTZuYZHk`);
  }
}
