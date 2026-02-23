import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  private returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to dashboard
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Capture the intended destination
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
  }

  get emailControl() { return this.loginForm.get('email')!; }
  get passwordControl() { return this.loginForm.get('password')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService
      .login({ email, password, rememberMe })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.notification.success('Welcome back!');
          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => {
          // Error notification is handled by the error interceptor
          this.loginForm.get('password')?.reset();
        },
      });
  }

  /** Helper for template-driven demo credential fill */
  fillDemoCredentials(role: 'admin' | 'hr' | 'employee'): void {
    const credentials = {
      admin: { email: 'admin@company.com', password: 'Admin@123' },
      hr: { email: 'hr@company.com', password: 'Hr@123' },
      employee: { email: 'employee@company.com', password: 'Employee@123' },
    };
    this.loginForm.patchValue(credentials[role]);
  }
}
