import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * HTTP interceptor for centralized error handling.
 * - 401: Logs out the user and redirects to login
 * - 403: Shows permission denied notification
 * - 5xx: Shows server error notification
 * - Other: Shows generic error notification
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
    );
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.authService.logout();
      this.notification.error('Your session has expired. Please log in again.');
      return;
    }

    if (error.status === 403) {
      this.notification.error('You do not have permission to perform this action.');
      return;
    }

    if (error.status === 404) {
      this.notification.warning('The requested resource was not found.');
      return;
    }

    if (error.status === 422) {
      const validationErrors = error.error?.errors;
      if (validationErrors) {
        const messages = Object.values(validationErrors).flat().join(', ');
        this.notification.error(`Validation failed: ${messages}`);
      } else {
        this.notification.error(error.error?.message ?? 'Validation error.');
      }
      return;
    }

    if (error.status >= 500) {
      this.notification.error('A server error occurred. Please try again later.');
      console.error('[ErrorInterceptor] Server error:', error);
      return;
    }

    if (error.status === 0) {
      this.notification.error('Network connection lost. Please check your connection.');
      return;
    }

    // Fallback for any other error
    const message = error.error?.message ?? error.message ?? 'An unexpected error occurred.';
    this.notification.error(message);
  }
}
