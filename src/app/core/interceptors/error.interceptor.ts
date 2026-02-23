import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

/**
 * Global HTTP error interceptor.
 * Maps common HTTP error status codes to user-friendly messages
 * and logs them via the structured logger.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      logger.error(
        `HTTP ${error.status} on ${req.method} ${req.url}`,
        'ErrorInterceptor',
        error,
      );

      const message = resolveErrorMessage(error);

      // Don't show notification for 401 — the auth interceptor handles those
      if (error.status !== 401) {
        notification.error(message);
      }

      return throwError(() => error);
    }),
  );
};

function resolveErrorMessage(error: HttpErrorResponse): string {
  // Server returned a structured error body
  if (error.error?.message) {
    return error.error.message;
  }

  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your inputs.';
    case 403:
      return 'You are not authorised to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 422:
      return 'The data provided could not be processed.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    case 0:
      return 'Unable to connect to the server. Please check your network connection.';
    default:
      return `An unexpected error occurred (${error.status}).`;
  }
}
