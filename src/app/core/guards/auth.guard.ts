import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '../models/user.model';

/**
 * Route guard: redirects unauthenticated users to the login page.
 * Optionally checks if the current user has one of the required roles
 * (specified via route data: `{ roles: ['admin', 'hr-manager'] }`).
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: router.url },
    });
    return false;
  }

  // Role-based access control
  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;
  if (requiredRoles?.length) {
    const hasAccess = authService.hasRole(...requiredRoles);
    if (!hasAccess) {
      notification.error('You do not have permission to access this page.');
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};

/**
 * Route guard: redirects already-authenticated users away from auth pages
 * (e.g., login) to the dashboard.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
