import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuToggled = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  get currentUser() {
    return this.authService.currentUser;
  }

  get userInitials(): string {
    const user = this.currentUser;
    if (!user) return '?';
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.email[0].toUpperCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
