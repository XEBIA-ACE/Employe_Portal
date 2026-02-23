import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, catchError, switchMap } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { LoggerService } from '@core/services/logger.service';

/**
 * Attaches the Bearer access token to every outgoing API request.
 * On 401, attempts a token refresh once; on second 401, clears session.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const logger = inject(LoggerService);

  // Skip auth header for login/refresh endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = authService.getAccessToken();
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        // Token expired — attempt silent refresh
        logger.debug('Access token expired, attempting refresh');
        return authService.refreshToken().pipe(
          switchMap((response) => {
            const newToken = response.data.accessToken;
            return next(addToken(req, newToken));
          }),
          catchError((refreshError) => {
            logger.error('Token refresh failed, logging out', refreshError);
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}
