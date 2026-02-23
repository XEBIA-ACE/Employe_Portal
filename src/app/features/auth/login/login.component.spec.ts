import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginResponse } from '../../../core/models/user.model';

const mockLoginResponse: LoginResponse = {
  accessToken: 'tok',
  refreshToken: 'refresh',
  expiresIn: 3600,
  user: {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'employee',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login'], {
      isAuthenticated: () => false,
      currentUser: () => null,
      isLoading: () => false,
      userRole: () => null,
    });
    notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with an invalid form', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should be invalid with missing email', () => {
    component.loginForm.patchValue({ email: '', password: 'validpass' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should be invalid with bad email format', () => {
    component.loginForm.patchValue({ email: 'not-an-email', password: 'validpass' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should be invalid when password is too short', () => {
    component.loginForm.patchValue({ email: 'a@b.com', password: 'short' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should be valid with correct credentials', () => {
    component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should call authService.login on valid submit', () => {
    authServiceSpy.login.and.returnValue(of(mockLoginResponse));
    component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    });
  });

  it('should not call authService.login when form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should show notification on successful login', () => {
    authServiceSpy.login.and.returnValue(of(mockLoginResponse));
    component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();
    expect(notificationSpy.success).toHaveBeenCalled();
  });

  it('should reset isLoading on login error', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));
    component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();
    expect(component.isLoading).toBeFalse();
  });
});
