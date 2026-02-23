import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'warn' | 'accent';
  icon?: string;
}

/**
 * Reusable confirmation dialog component.
 * Open via MatDialog.open(ConfirmationDialogComponent, { data: {...} })
 * Returns true when confirmed, false/undefined when cancelled.
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      @if (data.icon) {
        <div class="dialog-icon" [class]="'icon-' + (data.confirmColor ?? 'primary')">
          <mat-icon>{{ data.icon }}</mat-icon>
        </div>
      }

      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]="false">
          {{ data.cancelText ?? 'Cancel' }}
        </button>
        <button
          mat-raised-button
          [color]="data.confirmColor ?? 'primary'"
          [mat-dialog-close]="true"
          cdkFocusInitial
        >
          {{ data.confirmText ?? 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 8px;
      min-width: 300px;
      max-width: 480px;
    }

    .dialog-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      margin: 0 auto 16px;

      mat-icon {
        font-size: 28px;
        height: 28px;
        width: 28px;
      }

      &.icon-warn {
        background: #ffebee;
        color: #f44336;
      }

      &.icon-primary {
        background: #e8eaf6;
        color: #3f51b5;
      }
    }

    mat-dialog-content p {
      color: rgba(0, 0, 0, 0.6);
      line-height: 1.6;
      margin: 0;
    }

    mat-dialog-actions {
      padding: 16px 0 8px;
      gap: 8px;
    }
  `],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
