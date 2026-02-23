import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter" [color]="color"></mat-spinner>
      @if (message) {
        <p class="loading-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px;

      &.overlay {
        position: fixed;
        inset: 0;
        background: rgba(255, 255, 255, 0.8);
        z-index: 9999;
      }
    }

    .loading-message {
      margin: 0;
      color: rgba(0, 0, 0, 0.54);
      font-size: 0.9rem;
    }
  `],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 48;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() overlay = false;
  @Input() message = '';
}
