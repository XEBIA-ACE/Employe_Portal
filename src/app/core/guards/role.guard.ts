import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Role-based access control guard.
 * Add `data: { roles: ['admin', 'hr_manager'] }` to a route to restrict access.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): boolean | UrlTree {
    const requiredRoles = route.data['roles'] as UserRole[] | undefined;

    // If no roles specified, allow any authenticated user
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRole = this.authService.userRole as UserRole;
    const hasRole = requiredRoles.includes(userRole);

    if (hasRole) {
      return true;
    }

    // Redirect to a 403 page or dashboard with an error
    return this.router.createUrlTree(['/dashboard'], {
      queryParams: { error: 'forbidden' },
    });
  }
}
