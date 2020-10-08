import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaderResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageBase64Service {

  constructor(private httpClient: HttpClient) { }

  getFromURL(url: string): Promise<string | ArrayBuffer> {

    return this.httpClient.get(url, {
      responseType: 'blob'
    }).toPromise().then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        return reader.readAsDataURL(blob);
      });
    });
  }

  getMimeType(url: string): Observable<string> {
    return this.httpClient.head(url, {responseType: 'blob'})
      .pipe(map(response => response.type));
  }
}
