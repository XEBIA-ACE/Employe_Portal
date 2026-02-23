import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type SnackType = 'success' | 'error' | 'warning' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _unreadCount = signal(0);
  readonly unreadCount = this._unreadCount.asReadonly();

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  incrementUnread(): void {
    this._unreadCount.update((n) => n + 1);
  }

  clearUnread(): void {
    this._unreadCount.set(0);
  }

  private show(message: string, type: SnackType, duration: number): void {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      panelClass: [`snack-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
