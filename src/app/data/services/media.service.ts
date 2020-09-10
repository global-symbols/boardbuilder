import { Injectable } from '@angular/core';
import {environment} from '@env';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Media} from '@data/models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private apiEndpoint = `${environment.boardBuilderApiBase}/media`;

  constructor(private http: HttpClient) { }

  list(): Observable<Media[]> {
    return this.http.get<Media[]>(this.apiEndpoint)
      .pipe(map(arr => arr.map(item => new Media().deserialise(item))));
  }

  get(id: number|string, expand = ''): Observable<Media> {
    return this.http.get<Media>(`${this.apiEndpoint}/${id}`, { params: { expand } })
      .pipe(map(data => new Media().deserialise(data)));
  }

  add(file: File): Observable<Media> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<Media>(this.apiEndpoint, formData)
      .pipe(map(data => new Media().deserialise(data)));
      // .map(() => { return true; })
      // .catch((e) => this.handleError(e));

    // return this.http.post<Media>(this.apiEndpoint, record)
    //   .pipe(map(data => new Media().deserialise(data)));
  }
}
