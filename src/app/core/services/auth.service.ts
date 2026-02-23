import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserRole, LoginRequest, AuthResponse, JwtPayload } from '../models/user.model';

/**
 * Authentication service.
 * Handles login/logout, token storage, and current user state.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Stream of the currently authenticated user */
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Restore user from stored token on app bootstrap
    this.initFromStorage();
  }

  /** Get snapshot of the current user */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** True if the user is authenticated */
  get isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  /** Check if the current user has a specific role */
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  /** Check if the current user has one of several allowed roles */
  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.currentUser?.role as UserRole);
  }

  /**
   * Authenticate the user with email/password.
   * On success, stores the tokens and emits the user.
   */
  login(credentials: LoginRequest): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        map(response => response.user),
        catchError(err => {
          console.error('[AuthService] Login failed:', err);
          return throwError(() => err);
        }),
      );
  }

  /**
   * Log out the current user.
   * Clears tokens and redirects to login.
   */
  logout(): void {
    // Optionally call logout endpoint to invalidate refresh token
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get the stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(environment.jwtTokenKey);
  }

  /**
   * Get the stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(environment.jwtTokenKey, response.accessToken);
    localStorage.setItem(environment.refreshTokenKey, response.refreshToken);
    this.currentUserSubject.next(response.user);
  }

  private initFromStorage(): void {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      try {
        const payload = this.decodeToken(token);
        // Build a minimal user from the JWT claims; a real app would fetch the full profile
        const user: User = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          firstName: '',
          lastName: '',
          createdAt: new Date().toISOString(),
        };
        this.currentUserSubject.next(user);
      } catch {
        this.clearStorage();
      }
    }
  }

  private decodeToken(token: string): JwtPayload {
    // Simple base64 decode of the JWT payload section
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(environment.jwtTokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
  }
}
