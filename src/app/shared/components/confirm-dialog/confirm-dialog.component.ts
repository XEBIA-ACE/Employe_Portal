import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

/**
 * Generic confirmation dialog.
 * Returns true when the user confirms, false/undefined when cancelled.
 *
 * Usage:
 *   const ref = this.dialog.open(ConfirmDialogComponent, {
 *     data: { title: 'Delete Employee', message: 'Are you sure?' }
 *   });
 *   ref.afterClosed().subscribe(confirmed => { if (confirmed) { ... } });
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  get confirmText(): string {
    return this.data.confirmText ?? 'Confirm';
  }

  get cancelText(): string {
    return this.data.cancelText ?? 'Cancel';
  }

  get confirmColor(): string {
    return this.data.confirmColor ?? 'warn';
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
