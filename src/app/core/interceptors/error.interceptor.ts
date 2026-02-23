import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';
import { LoggerService } from '@core/services/logger.service';

/**
 * Global HTTP error handler.
 * Translates HTTP errors to user-friendly snack bar messages.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = extractErrorMessage(error);

      logger.error(`HTTP ${error.status} on ${req.method} ${req.url}`, {
        status: error.status,
        message
      });

      // Show user-friendly error notifications (skip 401 — auth interceptor handles it)
      if (error.status !== 401) {
        notificationService.error(message);
      }

      return throwError(() => error);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return Array.isArray(error.error.message)
      ? error.error.message.join(', ')
      : error.error.message;
  }

  switch (error.status) {
    case 400: return 'Invalid request. Please check your input.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflict occurred. The resource may already exist.';
    case 422: return 'Validation failed. Please check your data.';
    case 429: return 'Too many requests. Please slow down and try again.';
    case 500: return 'An internal server error occurred. Please try again later.';
    case 503: return 'The service is temporarily unavailable. Please try again later.';
    default:  return error.message || 'An unexpected error occurred.';
  }
}
