import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';
import { LoginResponse, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

const mockUser: User = {
  id: 'u1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'employee',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
};

const mockLoginResponse: LoginResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 3600,
  user: mockUser,
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatSnackBarModule],
      providers: [AuthService, LoggerService, NotificationService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should post credentials and store tokens on success', () => {
      service.login({ email: 'test@example.com', password: 'password123' }).subscribe((res) => {
        expect(res.accessToken).toBe('mock-access-token');
        expect(service.isAuthenticated()).toBeTrue();
        expect(service.currentUser()?.email).toBe('test@example.com');
        expect(localStorage.getItem('ep_access_token')).toBe('mock-access-token');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });

    it('should set isLoading to false after error', () => {
      service.login({ email: 'bad@example.com', password: 'wrong' }).subscribe({
        error: () => {
          expect(service.isLoading()).toBeFalse();
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout()', () => {
    it('should clear storage and reset user signal', () => {
      localStorage.setItem('ep_access_token', 'token');
      localStorage.setItem('ep_user', JSON.stringify(mockUser));

      service.logout();

      expect(service.isAuthenticated()).toBeFalse();
      expect(localStorage.getItem('ep_access_token')).toBeNull();
    });
  });

  describe('hasRole()', () => {
    it('should return false when not authenticated', () => {
      expect(service.hasRole('admin')).toBeFalse();
    });

    it('should return true for matching role', () => {
      // Simulate logged-in state
      localStorage.setItem('ep_user', JSON.stringify(mockUser));
      // Re-create service to pick up storage
      const freshService: AuthService = TestBed.inject(AuthService);
      expect(freshService.hasRole('employee')).toBeTrue();
      expect(freshService.hasRole('admin')).toBeFalse();
    });
  });

  describe('getAccessToken()', () => {
    it('should return null when no token stored', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('should return stored token', () => {
      localStorage.setItem('ep_access_token', 'my-token');
      expect(service.getAccessToken()).toBe('my-token');
    });
  });
});
