import { TestBed } from '@angular/core/testing';

import { ImageBase64Service } from './image-base64.service';

describe('ImageBase64Service', () => {
  let service: ImageBase64Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageBase64Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
