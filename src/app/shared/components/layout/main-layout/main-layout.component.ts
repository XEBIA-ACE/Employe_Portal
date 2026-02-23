import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>
      <div class="content-wrapper">
        <app-sidebar [collapsed]="sidebarCollapsed()"></app-sidebar>
        <main class="main-content" [class.expanded]="sidebarCollapsed()">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container { display: flex; flex-direction: column; min-height: 100vh; }
    .content-wrapper { display: flex; margin-top: 64px; flex: 1; }
    .main-content {
      flex: 1;
      padding: 24px;
      background: #f5f5f5;
      transition: margin-left 0.3s ease;
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent {
  readonly sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
