import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor that attaches the JWT Bearer token to all outgoing requests.
 * Skips public endpoints (login, etc.).
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Don't attach token to public endpoints
    if (this.isPublicEndpoint(req.url)) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      return next.handle(req);
    }

    // Clone the request and add the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': req.headers.get('Content-Type') ?? 'application/json',
      },
    });

    return next.handle(authReq);
  }

  private isPublicEndpoint(url: string): boolean {
    return this.publicEndpoints.some(endpoint => url.includes(endpoint));
  }
}
