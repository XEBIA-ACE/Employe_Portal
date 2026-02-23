import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Structured logging service.
 * Respects the configured log level and can be extended to
 * ship logs to a remote observability platform.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly minLevel: number;
  private readonly enableConsole: boolean;

  constructor() {
    this.minLevel = LOG_LEVELS[environment.logging.level as LogLevel] ?? LOG_LEVELS.debug;
    this.enableConsole = environment.logging.enableConsole;
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: unknown): void {
    this.log('error', message, context, data);
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    if (LOG_LEVELS[level] < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.enableConsole) {
      const prefix = context ? `[${context}]` : '';
      const formattedMessage = `${entry.timestamp} ${level.toUpperCase()} ${prefix} ${message}`;

      switch (level) {
        case 'debug':
          console.debug(formattedMessage, data ?? '');
          break;
        case 'info':
          console.info(formattedMessage, data ?? '');
          break;
        case 'warn':
          console.warn(formattedMessage, data ?? '');
          break;
        case 'error':
          console.error(formattedMessage, data ?? '');
          break;
      }
    }

    // Extension point: send to remote logging service (e.g., DataDog, Sentry)
    // this.remoteLogger.send(entry);
  }
}
