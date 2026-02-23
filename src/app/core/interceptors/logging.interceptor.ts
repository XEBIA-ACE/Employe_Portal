import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Structured HTTP request/response logger.
 * Only active in non-production environments (logLevel !== 'error').
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private readonly enabled = environment.logLevel !== 'error';

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!this.enabled) {
      return next.handle(req);
    }

    const startTime = Date.now();
    const correlationId = crypto.randomUUID().split('-')[0]; // Short ID for log correlation

    console.groupCollapsed(`[HTTP] ${req.method} ${req.url} [${correlationId}]`);
    console.log('Headers:', req.headers.keys().join(', '));
    if (req.body) console.log('Body:', req.body);
    console.groupEnd();

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log(
            `[HTTP] ${req.method} ${req.url} → ${event.status} (${duration}ms) [${correlationId}]`,
          );
        }
      }),
      finalize(() => {
        // finalize runs on both success and error paths
      }),
    );
  }
}
