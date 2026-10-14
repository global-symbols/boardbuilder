import {TestBed} from '@angular/core/testing';
import {DomSanitizer} from '@angular/platform-browser';
import {BypassSanitiserPipe} from './bypass-sanitiser.pipe';

describe('BypassSanitiserPipe', () => {
  it('create an instance', () => {
    const pipe = new BypassSanitiserPipe(TestBed.inject(DomSanitizer));
    expect(pipe).toBeTruthy();
  });
});
