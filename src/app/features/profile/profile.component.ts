import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  passwordForm!: FormGroup;
  isChangingPassword = false;
  activeSection: 'info' | 'security' = 'info';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.buildPasswordForm();
  }

  private buildPasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(group: FormGroup): { mismatch: true } | null {
    const newPwd = group.get('newPassword')?.value;
    const confirmPwd = group.get('confirmPassword')?.value;
    return newPwd === confirmPwd ? null : { mismatch: true };
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isChangingPassword = true;
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    this.authService
      .changePassword({ currentPassword, newPassword, confirmPassword })
      .pipe(finalize(() => (this.isChangingPassword = false)))
      .subscribe({
        next: () => {
          this.notifications.success('Password changed successfully.');
          this.passwordForm.reset();
        },
      });
  }

  get initials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`;
  }

  get roleLabel(): string {
    const labels: Record<string, string> = {
      admin: 'Administrator',
      hr_manager: 'HR Manager',
      team_lead: 'Team Lead',
      employee: 'Employee',
    };
    return labels[this.currentUser?.role ?? ''] ?? this.currentUser?.role ?? '';
  }
}
