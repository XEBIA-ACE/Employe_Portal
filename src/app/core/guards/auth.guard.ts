import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guards routes that require authentication.
 * Redirects unauthenticated users to /auth/login,
 * preserving the attempted URL for post-login redirect.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    return this.checkAuth(state.url);
  }

  private checkAuth(url: string): boolean | UrlTree {
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Preserve the intended URL so we can redirect after login
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: url },
    });
  }
}
