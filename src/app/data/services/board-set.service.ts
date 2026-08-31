import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BoardSet} from '@data/models/boardset.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env';
import {map} from 'rxjs/operators';
import * as JSZip from 'jszip';
import {ObzManifest} from '@data/models/obz-manifest.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardSetService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/board_sets`;

  constructor(private http: HttpClient) { }

  list(expand = ''): Observable<BoardSet[]> {
    return this.http.get<BoardSet[]>(this.apiEndpoint, { params: { expand } })
      .pipe(map(arr => arr.map(item => new BoardSet().deserialise(item))));
  }

  get(id: number|string, expand = ''): Observable<BoardSet> {
    return this.http.get<BoardSet>(`${this.apiEndpoint}/${id}`, { params: { expand } })
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  add(record: BoardSet): Observable<BoardSet> {
    return this.http.post<BoardSet>(this.apiEndpoint, record)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  update(record: BoardSet): Observable<BoardSet> {
    return this.http.patch<BoardSet>(`${this.apiEndpoint}/${record.id}`, record)
      .pipe(map(data => new BoardSet().deserialise(data)));
  }

  delete(record: BoardSet): Observable<BoardSet> {
    return this.http.delete<BoardSet>(`${this.apiEndpoint}/${record.id}`);
  }

  // Featured BoardSets
  featured(expand = ''): Observable<BoardSet[]> {
    return this.http.get<BoardSet[]>(`${this.apiEndpoint}/featured`, { params: { expand } })
      .pipe(map(arr => arr.map(item => new BoardSet().deserialise(item))));
  }

  // Update opened_at date
  touch(record: BoardSet): Observable<BoardSet> {

    record.opened_at = new Date();

    const params = new BoardSet({
      id: record.id,
      opened_at: record.opened_at
    });
    delete params.boards;

    return this.update(params);
  }

  convertToObz(boardSet: BoardSet): Promise<any> {
    const zip = new JSZip();

    // Prepare the bare OBZ Manifest data
    const manifest: ObzManifest = {
      format: 'open-board-0.1',
      root: 'boards/' + boardSet.boards[0].id.toString() + '.obf',
      paths: {
        boards: { },
        images: { },
        sounds: { }
      }
    };

    boardSet.boards.forEach(board => {
      const boardFilename = 'boards/' + board.id + '.obf';

      // Add the Board OBF file to the ZIP file.
      zip.file(boardFilename, JSON.stringify(board.toObf(), null, 2));

      // Add the Board OBF file path to the OBZ Manifest
      return manifest.paths.boards[board.id] = boardFilename;
    });

    // Add the OBZ Manifest file to the ZIP.
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    return zip.generateAsync({type: 'blob'});
  }
}
