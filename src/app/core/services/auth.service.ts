import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginCredentials,
  LoginResponse,
  AuthTokens,
  ChangePasswordRequest,
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

const TOKEN_KEY         = 'ep_access_token';
const REFRESH_TOKEN_KEY = 'ep_refresh_token';
const USER_KEY          = 'ep_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

  /** Stream of the currently authenticated user; null when logged out. */
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ─── Getters ─────────────────────────────────────────────────────────────

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.currentUser;
  }

  get userRole(): string {
    return this.currentUser?.role ?? '';
  }

  // ─── Auth Actions ─────────────────────────────────────────────────────────

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.persistSession(response.user, response.tokens, credentials.rememberMe);
        }),
        catchError((err) => throwError(() => err)),
      );
  }

  logout(): void {
    // Attempt a server-side logout (invalidates the refresh token)
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({ error: () => {} });
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<AuthTokens>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((tokens) => {
          this.setTokens(tokens);
        }),
      );
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, request);
  }

  // ─── Token Helpers ────────────────────────────────────────────────────────

  getAccessToken(): string | null {
    return (
      sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
    );
  }

  private getRefreshToken(): string | null {
    return (
      sessionStorage.getItem(REFRESH_TOKEN_KEY) ??
      localStorage.getItem(REFRESH_TOKEN_KEY)
    );
  }

  private setTokens(tokens: AuthTokens): void {
    const store = localStorage.getItem(TOKEN_KEY)
      ? localStorage
      : sessionStorage;
    store.setItem(TOKEN_KEY, tokens.accessToken);
    store.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private persistSession(
    user: User,
    tokens: AuthTokens,
    rememberMe = false,
  ): void {
    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, tokens.accessToken);
    store.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    store.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    [localStorage, sessionStorage].forEach((store) => {
      store.removeItem(TOKEN_KEY);
      store.removeItem(REFRESH_TOKEN_KEY);
      store.removeItem(USER_KEY);
    });
    this.currentUserSubject.next(null);
  }

  private loadUser(): User | null {
    const json =
      sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
    if (!json) return null;
    try {
      return JSON.parse(json) as User;
    } catch {
      return null;
    }
  }
}
