import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { LoginResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
    isActive: true,
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
  };

  const mockLoginResponse: LoginResponse = {
    user: mockUser,
    tokens: mockTokens,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear any persisted session state
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isAuthenticated when no token exists', () => {
    expect(service.isAuthenticated).toBeFalse();
  });

  describe('login()', () => {
    it('should POST credentials and persist session on success', () => {
      const credentials = { email: 'admin@example.com', password: 'password' };

      service.login(credentials).subscribe((response) => {
        expect(response.user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);

      req.flush(mockLoginResponse);

      expect(service.isAuthenticated).toBeTrue();
      expect(service.currentUser).toEqual(mockUser);
    });

    it('should emit the user on currentUser$ after login', () => {
      const emittedUsers: (typeof mockUser | null)[] = [];

      service.currentUser$.subscribe((user) => emittedUsers.push(user));

      service.login({ email: 'admin@example.com', password: 'password' }).subscribe();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
      req.flush(mockLoginResponse);

      expect(emittedUsers[emittedUsers.length - 1]).toEqual(mockUser);
    });
  });

  describe('logout()', () => {
    it('should clear session and redirect to login', () => {
      // Simulate a logged-in state
      sessionStorage.setItem('ep_access_token', 'test-token');
      sessionStorage.setItem('ep_current_user', JSON.stringify(mockUser));

      service.logout();

      // logout() fires a POST to /auth/logout (ignore it)
      httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`).flush({});

      expect(service.currentUser).toBeNull();
      expect(service.isAuthenticated).toBeFalse();
    });
  });

  describe('getAccessToken()', () => {
    it('should return null when no token is stored', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('should return the stored token', () => {
      sessionStorage.setItem('ep_access_token', 'my-token');
      expect(service.getAccessToken()).toBe('my-token');
    });
  });
});
