import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[]; // undefined = accessible by all authenticated users
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Employees', route: '/employees', icon: 'people', roles: ['admin', 'hr-manager', 'manager'] },
    { label: 'Departments', route: '/employees/departments', icon: 'corporate_fare', roles: ['admin', 'hr-manager'] },
    { label: 'Reports', route: '/reports', icon: 'bar_chart', roles: ['admin', 'hr-manager', 'manager'] },
    { label: 'My Profile', route: '/profile', icon: 'account_circle' },
  ];

  isNavItemVisible(item: NavItem): boolean {
    if (!item.roles?.length) return true;
    return this.authService.hasRole(...item.roles);
  }
}
