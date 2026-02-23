import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;

  currentUrl = '';

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',  icon: '📊', route: '/dashboard' },
    { label: 'Employees',  icon: '👥', route: '/employees' },
    {
      label: 'Add Employee',
      icon: '➕',
      route: '/employees/new',
      roles: ['admin', 'hr_manager'],
    },
    { label: 'My Profile', icon: '👤', route: '/profile' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentUrl = (e as NavigationEnd).urlAfterRedirects;
      });
  }

  isActive(route: string): boolean {
    if (route === '/dashboard') {
      return this.currentUrl === '/dashboard' || this.currentUrl === '/';
    }
    return this.currentUrl.startsWith(route);
  }

  isVisible(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    const role = this.authService.userRole as UserRole;
    return item.roles.includes(role);
  }

  logout(): void {
    this.authService.logout();
  }
}
