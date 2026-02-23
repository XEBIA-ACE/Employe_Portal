import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Components
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NotificationComponent } from './components/notification/notification.component';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';

// Pipes
import { ReplacePipe } from './pipes/replace.pipe';
import { FullNamePipe } from './pipes/full-name.pipe';

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  LoadingSpinnerComponent,
  NotificationComponent,
];

const DIRECTIVES = [HasRoleDirective];

const PIPES = [ReplacePipe, FullNamePipe];

/**
 * SharedModule provides reusable UI components, directives, and pipes.
 * Import this in any feature module that needs these building blocks.
 * Do NOT import CoreModule here — that would create circular dependencies.
 */
@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  imports: [CommonModule, RouterModule],
  exports: [
    // Re-export Angular modules used across the app
    CommonModule,
    RouterModule,
    // Our shared building blocks
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
})
export class SharedModule {}
