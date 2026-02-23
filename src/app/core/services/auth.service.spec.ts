import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { environment } from '@environments/environment';
import { AuthUser } from '@core/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthUser: AuthUser = {
    user: {
      id: '1',
      employeeId: 'EMP001',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      departmentId: 'dept-1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, LoggerService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  describe('login()', () => {
    it('should authenticate and store tokens on successful login', () => {
      service.login({ email: 'admin@example.com', password: 'password123' }).subscribe({
        next: (res) => {
          expect(res.data).toEqual(mockAuthUser);
          expect(service.isAuthenticated()).toBe(true);
          expect(service.currentUser()?.email).toBe('admin@example.com');
          expect(localStorage.getItem(environment.tokenKey)).toBe('mock-access-token');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ data: mockAuthUser });
    });

    it('should propagate error on failed login', () => {
      let errorReceived = false;

      service.login({ email: 'wrong@example.com', password: 'wrongpass' }).subscribe({
        error: () => { errorReceived = true; }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

      expect(errorReceived).toBe(true);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole()', () => {
    it('should return false when not authenticated', () => {
      expect(service.hasRole(['admin'])).toBe(false);
    });
  });

  describe('getAccessToken()', () => {
    it('should return null when not logged in', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('should return token after login', () => {
      service.login({ email: 'admin@example.com', password: 'password123' }).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ data: mockAuthUser });

      expect(service.getAccessToken()).toBe('mock-access-token');
    });
  });
});
