import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Global HTTP error handler.
 * Maps common HTTP error codes to user-friendly notifications and
 * re-throws the error so components can react if needed.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.extractMessage(error);

        switch (error.status) {
          case 0:
            this.notificationService.error(
              'Connection Error',
              'Unable to reach the server. Check your network connection.',
            );
            break;
          case 400:
            this.notificationService.error('Bad Request', message);
            break;
          case 403:
            this.notificationService.error(
              'Access Denied',
              'You do not have permission to perform this action.',
            );
            break;
          case 404:
            this.notificationService.error('Not Found', message);
            break;
          case 409:
            this.notificationService.error('Conflict', message);
            break;
          case 422:
            this.notificationService.error('Validation Error', message);
            break;
          case 429:
            this.notificationService.warning(
              'Rate Limited',
              'Too many requests. Please wait before trying again.',
            );
            break;
          case 500:
          case 502:
          case 503:
            this.notificationService.error(
              'Server Error',
              'An unexpected error occurred. Please try again later.',
            );
            break;
          default:
            if (error.status !== 401) {
              // 401s are handled by AuthInterceptor
              this.notificationService.error('Error', message);
            }
        }

        return throwError(() => error);
      }),
    );
  }

  private extractMessage(error: HttpErrorResponse): string {
    const body = error.error;
    if (!body) return error.message;
    if (typeof body === 'string') return body;
    if (Array.isArray(body.message)) return body.message.join(', ');
    return body.message ?? error.message;
  }
}
