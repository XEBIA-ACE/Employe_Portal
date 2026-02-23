import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  User,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  RefreshTokenRequest,
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

const TOKEN_KEY = 'ep_access_token';
const REFRESH_TOKEN_KEY = 'ep_refresh_token';
const USER_KEY = 'ep_user';

/**
 * Authentication service handling login, logout, token management,
 * and exposing the current user state via Angular signals.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  // Reactive state via Angular 17 signals
  private readonly _currentUser = signal<User | null>(this.loadUserFromStorage());
  private readonly _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isLoading = this._isLoading.asReadonly();
  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService,
    private notification: NotificationService,
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this._isLoading.set(true);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.storeTokens(response.accessToken, response.refreshToken);
        this.storeUser(response.user);
        this._currentUser.set(response.user);
        this._isLoading.set(false);
        this.logger.info('User logged in', 'AuthService', { userId: response.user.id });
      }),
      catchError((error) => {
        this._isLoading.set(false);
        this.logger.error('Login failed', 'AuthService', error);
        return throwError(() => error);
      }),
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    this._isLoading.set(true);
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, data).pipe(
      tap(() => this._isLoading.set(false)),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    const user = this._currentUser();
    this.clearStorage();
    this._currentUser.set(null);
    this.logger.info('User logged out', 'AuthService', { userId: user?.id });
    this.router.navigate(['/auth/login']);
    this.notification.info('You have been signed out.');
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const payload: RefreshTokenRequest = { refreshToken };
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, payload).pipe(
      tap((response) => {
        this.storeTokens(response.accessToken, response.refreshToken);
        this.storeUser(response.user);
        this._currentUser.set(response.user);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  changePassword(payload: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, payload);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/profile`, payload).pipe(
      tap((response) => {
        this.storeUser(response.data);
        this._currentUser.set(response.data);
      }),
    );
  }

  hasRole(...roles: string[]): boolean {
    const userRole = this._currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private loadUserFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
