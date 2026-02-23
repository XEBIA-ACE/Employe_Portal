import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Centralised notification service wrapping Angular Material Snackbar.
 * Provides typed helpers for common notification scenarios.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaultDuration = 4000; // ms

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action = 'Dismiss', duration = this.defaultDuration): void {
    this.show(message, action, 'success-snack', duration);
  }

  error(message: string, action = 'Dismiss', duration = 6000): void {
    this.show(message, action, 'error-snack', duration);
  }

  warning(message: string, action = 'Dismiss', duration = this.defaultDuration): void {
    this.show(message, action, 'warning-snack', duration);
  }

  info(message: string, action = 'Dismiss', duration = this.defaultDuration): void {
    this.show(message, action, '', duration);
  }

  private show(
    message: string,
    action: string,
    panelClass: string,
    duration: number
  ): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: panelClass ? [panelClass] : [],
    };

    this.snackBar.open(message, action, config);
  }
}
