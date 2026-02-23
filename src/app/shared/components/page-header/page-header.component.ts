import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export interface Breadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumbs" *ngIf="breadcrumbs.length > 0">
          <ng-container *ngFor="let crumb of breadcrumbs; let last = last">
            <a *ngIf="crumb.route && !last" [routerLink]="crumb.route" class="crumb-link">
              {{ crumb.label }}
            </a>
            <span *ngIf="!crumb.route || last" [class.active]="last">{{ crumb.label }}</span>
            <mat-icon *ngIf="!last" class="crumb-sep">chevron_right</mat-icon>
          </ng-container>
        </div>

        <div class="title-row">
          <div class="title-group">
            <mat-icon *ngIf="icon" class="page-icon">{{ icon }}</mat-icon>
            <div>
              <h1 class="page-title">{{ title }}</h1>
              <p class="page-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <div class="actions">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .breadcrumbs {
      display: flex; align-items: center; gap: 4px;
      font-size: 0.8rem; color: rgba(0,0,0,.5); margin-bottom: 8px;
    }
    .crumb-link { color: #3f51b5; text-decoration: none; }
    .crumb-link:hover { text-decoration: underline; }
    .crumb-sep { font-size: 16px; width: 16px; height: 16px; }
    .active { color: rgba(0,0,0,.7); font-weight: 500; }
    .title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .title-group { display: flex; align-items: center; gap: 12px; }
    .page-icon { font-size: 32px; width: 32px; height: 32px; color: #3f51b5; }
    .page-title { margin: 0; font-size: 1.75rem; font-weight: 600; color: rgba(0,0,0,.87); }
    .page-subtitle { margin: 4px 0 0; color: rgba(0,0,0,.5); font-size: 0.875rem; }
    .actions { display: flex; gap: 8px; align-items: center; }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() breadcrumbs: Breadcrumb[] = [];
}
