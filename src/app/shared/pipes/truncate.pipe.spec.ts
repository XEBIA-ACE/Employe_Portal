import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null, 10)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(pipe.transform(undefined, 10)).toBe('');
  });

  it('should return the original string when it is shorter than maxLength', () => {
    expect(pipe.transform('Hello', 10)).toBe('Hello');
  });

  it('should return the original string when it equals maxLength', () => {
    expect(pipe.transform('Hello', 5)).toBe('Hello');
  });

  it('should truncate and append default ellipsis when string exceeds maxLength', () => {
    const result = pipe.transform('Hello World', 5);
    expect(result).toBe('Hello…');
  });

  it('should use a custom suffix', () => {
    const result = pipe.transform('Hello World', 5, '...');
    expect(result).toBe('Hello...');
  });

  it('should trim trailing whitespace before appending suffix', () => {
    const result = pipe.transform('Hello   World', 6);
    // 'Hello ' → trimmed → 'Hello' + '…'
    expect(result).toBe('Hello…');
  });
});
