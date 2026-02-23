import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';
import { NotificationService } from '../services/notification.service';

/**
 * Guards routes based on user role.
 * Expected usage in route config:
 *   { path: 'admin', canActivate: [RoleGuard], data: { roles: ['admin'] } }
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles: UserRole[] = route.data['roles'] ?? [];

    if (allowedRoles.length === 0) {
      // No role restriction on this route
      return true;
    }

    if (this.authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    this.notification.error('You do not have permission to access this page.');
    return this.router.createUrlTree(['/dashboard']);
  }
}
