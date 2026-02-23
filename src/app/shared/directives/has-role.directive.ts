import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

/**
 * Structural directive for role-based UI visibility.
 *
 * Usage:
 *   <button *appHasRole="['admin', 'hr_manager']">Restricted Action</button>
 */
@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') requiredRoles: UserRole[] = [];

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    this.viewContainerRef.clear();

    const hasRole =
      !this.requiredRoles.length ||
      this.requiredRoles.includes(this.authService.userRole as UserRole);

    if (hasRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
