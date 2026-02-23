import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

/**
 * Structural directive for role-based visibility.
 *
 * Shows the host element only if the current user has the required role(s).
 *
 * Usage:
 *   <button *appHasRole="'admin'">Admin only</button>
 *   <div *appHasRole="['admin', 'hr']">Admin or HR</div>
 */
@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {
  private roles: UserRole[] = [];

  @Input('appHasRole')
  set appHasRole(value: UserRole | UserRole[]) {
    this.roles = Array.isArray(value) ? value : [value];
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.hasAnyRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
