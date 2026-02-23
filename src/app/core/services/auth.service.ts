import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, EMPTY } from 'rxjs';
import { environment } from '@environments/environment';
import { User, AuthUser, LoginRequest, ChangePasswordRequest } from '@core/models/user.model';
import { ApiResponse } from '@core/models/api.model';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Angular signals for reactive auth state
  private readonly _currentUser = signal<User | null>(this.loadUserFromStorage());
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isHrManager = computed(() =>
    ['admin', 'hr_manager'].includes(this._currentUser()?.role ?? '')
  );
  readonly isManager = computed(() =>
    ['admin', 'hr_manager', 'manager'].includes(this._currentUser()?.role ?? '')
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService
  ) {}

  login(credentials: LoginRequest): Observable<ApiResponse<AuthUser>> {
    this._isLoading.set(true);
    return this.http.post<ApiResponse<AuthUser>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const { user, accessToken, refreshToken } = response.data;
        this.storeTokens(accessToken, refreshToken);
        this._currentUser.set(user);
        this.logger.info('User logged in', { userId: user.id, email: user.email });
      }),
      catchError((error) => {
        this.logger.error('Login failed', error);
        return throwError(() => error);
      }),
      tap(() => this._isLoading.set(false))
    );
  }

  logout(): void {
    const user = this._currentUser();
    this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(() => EMPTY) // Best-effort logout call
    ).subscribe();

    this.clearSession();
    this.logger.info('User logged out', { userId: user?.id });
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthUser>> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<ApiResponse<AuthUser>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          this.storeTokens(accessToken, newRefreshToken);
        }),
        catchError((error) => {
          this.clearSession();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, payload).pipe(
      tap(() => this.logger.info('Password changed')),
      catchError((error) => {
        this.logger.error('Password change failed', error);
        return throwError(() => error);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  hasRole(roles: string[]): boolean {
    const userRole = this._currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(environment.tokenKey, accessToken);
    localStorage.setItem(environment.refreshTokenKey, refreshToken);
    // Also persist user from token to survive page refresh
    const user = this._currentUser();
    if (user) {
      localStorage.setItem('ep_user', JSON.stringify(user));
    }
  }

  private clearSession(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem('ep_user');
    this._currentUser.set(null);
  }

  private loadUserFromStorage(): User | null {
    try {
      const raw = localStorage.getItem('ep_user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
