import { InitialsPipe } from './initials.pipe';

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;

  beforeEach(() => {
    pipe = new InitialsPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return initials for a full name', () => {
    expect(pipe.transform('John Doe')).toBe('JD');
  });

  it('should return single initial for a single name', () => {
    expect(pipe.transform('Alice')).toBe('A');
  });

  it('should only use first two words', () => {
    expect(pipe.transform('Mary Jane Watson')).toBe('MJ');
  });

  it('should return empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should uppercase initials', () => {
    expect(pipe.transform('john doe')).toBe('JD');
  });

  it('should handle extra whitespace', () => {
    expect(pipe.transform('  John   Doe  ')).toBe('JD');
  });
});
