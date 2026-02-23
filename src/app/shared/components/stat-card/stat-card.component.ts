import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card" [style.--accent-color]="color">
      <mat-card-content>
        <div class="card-body">
          <div class="stat-info">
            <p class="stat-label">{{ label }}</p>
            <h2 class="stat-value">{{ value | number }}</h2>
            <p class="stat-change" *ngIf="changeLabel" [class.positive]="changePositive">
              <mat-icon inline>{{ changePositive ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ changeLabel }}
            </p>
          </div>
          <div class="stat-icon">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      border-radius: 12px;
      border-left: 4px solid var(--accent-color, #3f51b5);
      transition: box-shadow 0.2s ease;
    }
    .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.15); }
    .card-body { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
    .stat-label { margin: 0 0 4px; font-size: 0.8rem; color: rgba(0,0,0,.5); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { margin: 0 0 8px; font-size: 2rem; font-weight: 700; color: rgba(0,0,0,.87); }
    .stat-change { margin: 0; font-size: 0.8rem; color: #f44336; display: flex; align-items: center; gap: 2px; }
    .stat-change.positive { color: #4caf50; }
    .stat-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--accent-color, #3f51b5);
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon mat-icon { color: #fff; font-size: 28px; width: 28px; height: 28px; }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() icon = 'info';
  @Input() color = '#3f51b5';
  @Input() changeLabel = '';
  @Input() changePositive = true;
}
