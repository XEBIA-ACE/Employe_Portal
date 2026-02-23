import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;   // ms; 0 = persistent until dismissed
  dismissible?: boolean;
}

/**
 * Application-wide notification service.
 * Components inject this to emit toasts; the NotificationComponent subscribes.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  success(title: string, message?: string, duration = 4000): void {
    this.emit({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration = 6000): void {
    this.emit({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration = 5000): void {
    this.emit({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration = 4000): void {
    this.emit({ type: 'info', title, message, duration });
  }

  private emit(partial: Omit<Notification, 'id'>): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      dismissible: true,
      ...partial,
    };
    this.notificationSubject.next(notification);
  }
}
