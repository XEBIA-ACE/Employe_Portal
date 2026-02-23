import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs';
import { LoggerService } from '@core/services/logger.service';

/**
 * Logs every outgoing HTTP request and its response time.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const startTime = Date.now();

  logger.debug(`--> ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: () => {
        const elapsed = Date.now() - startTime;
        logger.debug(`<-- ${req.method} ${req.url} (${elapsed}ms)`);
      },
      error: (error) => {
        const elapsed = Date.now() - startTime;
        logger.warn(`<-- ${req.method} ${req.url} [${error.status}] (${elapsed}ms)`);
      }
    }),
    finalize(() => {
      // Any cleanup on complete/error
    })
  );
};
