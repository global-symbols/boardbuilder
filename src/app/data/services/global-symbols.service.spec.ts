import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {GlobalSymbolsService} from './global-symbols.service';
import {environment} from '@env';

describe('GlobalSymbolsService', () => {
  let service: GlobalSymbolsService;
  let httpMock: HttpTestingController;
  const proxyBase = `${environment.boardBuilderApiBase}/global_symbols`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GlobalSymbolsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads languages via Board Builder global_symbols proxy', () => {
    service.getLanguages().subscribe();
    const req = httpMock.expectOne(`${proxyBase}/languages/active`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('loads symbolsets via Board Builder global_symbols proxy', () => {
    service.getSymbolSets().subscribe();
    const req = httpMock.expectOne(`${proxyBase}/symbolsets`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('searches labels via Board Builder global_symbols proxy', async () => {
    const promise = service.search({
      query: 'dog',
      language: 'eng',
      language_iso_format: '639-3',
      limit: 48,
      expand: 'picto.symbolset',
    });
    const req = httpMock.expectOne(
      (r) => r.url === `${proxyBase}/labels/search` && r.params.get('query') === 'dog'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('expand')).toBe('picto.symbolset');
    req.flush([
      {
        id: 1,
        text: 'dog',
        picto: {
          id: 2,
          image_url: 'https://example.com/dog.png',
          adaptable: false,
          symbolset: { name: 'Mulberry Symbols' },
        },
      },
    ]);
    const results = await promise;
    expect(results.length).toBe(1);
    expect(results[0].label).toBe('dog');
    expect(results[0].imageUrl).toBe('https://example.com/dog.png');
  });
});
