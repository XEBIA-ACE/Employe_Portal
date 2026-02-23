import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];   // If set, only show to users with these roles
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  /** Emitted when user clicks a nav item on mobile (closes the sidenav) */
  @Output() closeSidenav = new EventEmitter<void>();

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    {
      label: 'Employees',
      icon: 'people',
      route: '/employees',
      roles: [UserRole.ADMIN, UserRole.HR],
    },
    {
      label: 'Departments',
      icon: 'business',
      route: '/departments',
      roles: [UserRole.ADMIN, UserRole.HR],
    },
    { label: 'My Profile', icon: 'person', route: '/profile' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  get currentUser() {
    return this.authService.currentUser;
  }

  get userInitials(): string {
    const user = this.currentUser;
    if (!user) return '?';
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email[0].toUpperCase();
  }

  isVisible(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.authService.hasAnyRole(item.roles);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.closeSidenav.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
