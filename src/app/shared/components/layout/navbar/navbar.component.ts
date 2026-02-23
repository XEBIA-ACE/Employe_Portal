import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <!-- Sidebar toggle -->
      <button mat-icon-button (click)="toggleSidebar.emit()" aria-label="Toggle sidebar">
        <mat-icon>menu</mat-icon>
      </button>

      <span class="app-title">{{ appTitle }}</span>
      <span class="spacer"></span>

      <!-- Notifications -->
      <button
        mat-icon-button
        [matBadge]="unreadCount() || null"
        matBadgeColor="warn"
        aria-label="Notifications">
        <mat-icon>notifications</mat-icon>
      </button>

      <!-- User avatar / menu -->
      <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
        <mat-icon>account_circle</mat-icon>
        <span class="user-name">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <div class="user-menu-header">
          <strong>{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</strong>
          <small>{{ currentUser()?.email }}</small>
          <small class="role-badge">{{ currentUser()?.role | titlecase }}</small>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          My Profile
        </button>
        <button mat-menu-item routerLink="/profile/settings">
          <mat-icon>settings</mat-icon>
          Settings
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sign Out
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
    .app-title { font-size: 1.2rem; font-weight: 600; margin-left: 8px; }
    .spacer { flex: 1; }
    .user-btn { display: flex; align-items: center; gap: 4px; }
    .user-name { margin: 0 4px; }
    .user-menu-header {
      display: flex; flex-direction: column; padding: 12px 16px; min-width: 200px;
    }
    .user-menu-header small { color: rgba(0,0,0,.6); font-size: 0.75rem; margin-top: 2px; }
    .role-badge {
      display: inline-block; background: #e3f2fd; color: #1565c0;
      padding: 2px 8px; border-radius: 12px; margin-top: 4px;
    }
  `]
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly appTitle = 'Employee Portal';
  readonly currentUser = this.authService.currentUser;
  readonly unreadCount = this.notificationService.unreadCount;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}
