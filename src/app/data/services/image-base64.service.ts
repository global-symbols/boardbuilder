import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
}
