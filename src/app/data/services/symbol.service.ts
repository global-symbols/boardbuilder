import {Injectable, Renderer2} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SymbolSearchResult} from '@data/models/symbol-search-result';
import {map} from 'rxjs/operators';
import {environment} from '@env';
import {Observable} from 'rxjs';
import {SearchSource} from '@data/services/global-symbols.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SymbolService {

  private apiBase = null;
  private _renderer: Renderer2;

  constructor(
    public http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.apiBase = environment.boardBuilderApiBase;
  }

  search(query, source: SearchSource): Observable<SymbolSearchResult[]> {

    if (source.key === 'open-symbols') {

      // Perform OpenSymbols searches directly.
      return this.http.get<any[]>('https://www.opensymbols.org/api/v1/symbols/search', { params: { q: query } })
        .pipe(map(arr => arr.map(result => new SymbolSearchResult().deserialise({
          id: result.id,
          label: result.name,
          tooltip: result.name,
          imageUrl: result.image_url
        }))));

    } else {

      // Perform all other searches through the BB API.
      return this.http.get<SymbolSearchResult[]>(this.apiBase + '/symbols/search', { params: { query, source: source.key } })
        .pipe(map(arr => arr.map(sr => new SymbolSearchResult().deserialise(sr))));
    }
  }

  getSVG(url: string): Observable<SVGElement> {
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map((svgText: string) => {
          const svgEl = this._svgElementFromString(svgText);
          return SymbolService._cloneSVG(svgEl);
        })
      );
  }

  private _svgElementFromString(str: string): SVGElement | never {
    const div = this._renderer.createElement('DIV');
    div.innerHTML = str;

    const svg = div.querySelector('svg') as SVGElement;

    if (!svg) {
      throw new Error('No SVG found in loaded contents');
    }

    return svg;
  }

  private static _cloneSVG(svg: SVGElement): SVGElement {
    return svg.cloneNode(true) as SVGElement;
  }

  getFile(url): Observable<SafeHtml> {
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map(data => this.sanitizer.bypassSecurityTrustHtml(data))
      );
  }
}
