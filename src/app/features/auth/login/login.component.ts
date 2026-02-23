import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card mat-elevation-z4">
        <mat-card-header class="login-header">
          <mat-icon class="logo-icon">business</mat-icon>
          <h1>Employee Portal</h1>
          <p>Sign in to your account</p>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="you@company.com"
                autocomplete="email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Enter a valid email address</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                autocomplete="current-password">
              <mat-icon matPrefix>lock</mat-icon>
              <button type="button" mat-icon-button matSuffix (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">Password must be at least 8 characters</mat-error>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="loginForm.invalid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer class="login-footer">
          <p class="version">v{{ version }} &mdash; &copy; {{ currentYear }} Employee Portal</p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3f51b5 0%, #7c4dff 100%);
      padding: 24px;
    }
    .login-card { width: 100%; max-width: 420px; border-radius: 16px; overflow: hidden; }
    .login-header {
      display: flex; flex-direction: column; align-items: center;
      padding: 32px 24px 16px; background: #3f51b5; color: #fff;
    }
    .logo-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 8px; }
    .login-header h1 { margin: 0 0 4px; font-size: 1.5rem; }
    .login-header p { margin: 0; opacity: 0.8; }
    mat-card-content { padding: 24px 24px 8px; }
    .full-width { width: 100%; }
    .form-options {
      display: flex; align-items: center; justify-content: space-between;
      margin: 4px 0 16px;
    }
    .forgot-link { color: #3f51b5; font-size: 0.875rem; text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }
    .submit-btn { height: 48px; font-size: 1rem; margin-top: 8px; }
    .submit-btn mat-spinner { display: inline-block; margin-right: 8px; }
    .login-footer { padding: 12px 24px; background: #fafafa; }
    .version { margin: 0; font-size: 0.75rem; color: rgba(0,0,0,.4); text-align: center; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl = '/dashboard';
  version = '1.0.0';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password, rememberMe }).subscribe({
      next: () => {
        this.notificationService.success('Welcome back!');
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;
        const message = err?.error?.message ?? 'Invalid email or password.';
        this.notificationService.error(message);
      }
    });
  }
}
