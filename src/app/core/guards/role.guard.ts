import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

/**
 * Protects routes based on user roles.
 * Usage: canActivate: [authGuard, roleGuard]
 * Route data: { roles: ['admin', 'hr_manager'] }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (requiredRoles.length === 0 || authService.hasRole(requiredRoles)) {
    return true;
  }

  notificationService.error('You do not have permission to access this page.');
  router.navigate(['/dashboard']);
  return false;
};
