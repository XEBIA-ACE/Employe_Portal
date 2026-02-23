import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LoggerService] });
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose debug(), info(), warn(), error() methods', () => {
    expect(typeof service.debug).toBe('function');
    expect(typeof service.info).toBe('function');
    expect(typeof service.warn).toBe('function');
    expect(typeof service.error).toBe('function');
  });

  it('should not throw when logging with optional context and data', () => {
    expect(() => service.info('Test message', 'TestContext', { foo: 'bar' })).not.toThrow();
    expect(() => service.error('Error occurred')).not.toThrow();
    expect(() => service.warn('Warning')).not.toThrow();
    expect(() => service.debug('Debug info')).not.toThrow();
  });
});
