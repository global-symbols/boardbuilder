import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '@env';
import {Folder} from '@data/models/folder.model';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiEndpoint = `${environment.boardBuilderApiBase}/folders`;

  constructor(private http: HttpClient) {}

  list(): Observable<Folder[]> {
    return this.http.get<Folder[]>(this.apiEndpoint)
      .pipe(map(arr => arr.map(item => new Folder().deserialise(item))));
  }

  add(name: string): Observable<Folder> {
    return this.http.post<Folder>(this.apiEndpoint, { name })
      .pipe(map(data => new Folder().deserialise(data)));
  }

  update(folder: Folder): Observable<Folder> {
    return this.http.patch<Folder>(`${this.apiEndpoint}/${folder.id}`, { name: folder.name, position: folder.position })
      .pipe(map(data => new Folder().deserialise(data)));
  }

  delete(folder: Folder): Observable<void> {
    return this.http.delete<void>(`${this.apiEndpoint}/${folder.id}`);
  }
}
