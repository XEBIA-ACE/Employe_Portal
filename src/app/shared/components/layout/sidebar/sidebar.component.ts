import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <mat-nav-list>
        <ng-container *ngFor="let item of visibleNavItems">
          <a
            mat-list-item
            [routerLink]="item.route"
            routerLinkActive="active-link"
            [matTooltip]="collapsed ? item.label : ''"
            matTooltipPosition="right">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle *ngIf="!collapsed">{{ item.label }}</span>
          </a>
        </ng-container>
      </mat-nav-list>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      min-height: calc(100vh - 64px);
      background: #fff;
      border-right: 1px solid rgba(0,0,0,.12);
      transition: width 0.3s ease;
      overflow: hidden;
    }
    .sidebar.collapsed { width: 64px; }
    .active-link { background: rgba(63,81,181,.1) !important; color: #3f51b5 !important; }
    .active-link mat-icon { color: #3f51b5; }
    mat-nav-list { padding-top: 8px; }
    a[mat-list-item] { border-radius: 0 24px 24px 0; margin-right: 8px; }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',   icon: 'dashboard',   route: '/dashboard' },
    { label: 'Employees',   icon: 'people',      route: '/employees' },
    { label: 'Departments', icon: 'business',    route: '/departments', roles: ['admin', 'hr_manager'] },
    { label: 'Attendance',  icon: 'schedule',    route: '/attendance' },
    { label: 'Leave',       icon: 'event_busy',  route: '/leave' },
    { label: 'Reports',     icon: 'bar_chart',   route: '/reports',    roles: ['admin', 'hr_manager', 'manager'] },
    { label: 'Settings',    icon: 'settings',    route: '/settings',   roles: ['admin'] }
  ];

  constructor(private authService: AuthService) {}

  get visibleNavItems(): NavItem[] {
    return this.navItems.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return this.authService.hasRole(item.roles);
    });
  }
}
