import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Centralized notification service using Angular Material Snackbar.
 * Provides success, error, warning, and info messages.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  /** Show a success notification */
  success(message: string, action = 'Dismiss'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['success-snackbar'],
    });
  }

  /** Show an error notification (longer duration) */
  error(message: string, action = 'Dismiss'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 6000,
      panelClass: ['error-snackbar'],
    });
  }

  /** Show a warning notification */
  warning(message: string, action = 'Dismiss'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['warning-snackbar'],
    });
  }

  /** Show an info notification */
  info(message: string, action = 'Dismiss'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
    });
  }

  /** Dismiss the current snackbar */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
