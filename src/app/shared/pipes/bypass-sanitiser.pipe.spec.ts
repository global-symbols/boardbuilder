import { BypassSanitiserPipe } from './bypass-sanitiser.pipe';

describe('BypassSanitiserPipe', () => {
  it('create an instance', () => {
    const pipe = new BypassSanitiserPipe();
    expect(pipe).toBeTruthy();
  });
});
