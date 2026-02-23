import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeaveService } from '@core/services/leave.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-leave-request-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>New Leave Request</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="leave-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Leave Type *</mat-label>
          <mat-select formControlName="leaveType">
            <mat-option value="annual">Annual Leave</mat-option>
            <mat-option value="sick">Sick Leave</mat-option>
            <mat-option value="maternity">Maternity Leave</mat-option>
            <mat-option value="paternity">Paternity Leave</mat-option>
            <mat-option value="unpaid">Unpaid Leave</mat-option>
            <mat-option value="emergency">Emergency Leave</mat-option>
            <mat-option value="study">Study Leave</mat-option>
          </mat-select>
          <mat-error>Required</mat-error>
        </mat-form-field>

        <div class="date-row">
          <mat-form-field appearance="outline">
            <mat-label>Start Date *</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDate" [min]="today">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-error>Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>End Date *</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDate" [min]="form.get('startDate')?.value">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
            <mat-error>Required</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Reason *</mat-label>
          <textarea matInput formControlName="reason" rows="4" placeholder="Describe the reason for your leave request..."></textarea>
          <mat-error *ngIf="form.get('reason')?.hasError('required')">Required</mat-error>
          <mat-error *ngIf="form.get('reason')?.hasError('minlength')">At least 10 characters</mat-error>
          <mat-hint align="end">{{ form.get('reason')?.value?.length || 0 }}/500</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="form.invalid || submitting">
        <mat-spinner *ngIf="submitting" diameter="20"></mat-spinner>
        <span *ngIf="!submitting">Submit Request</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .leave-form { display: flex; flex-direction: column; gap: 4px; min-width: 460px; padding-top: 8px; }
    .full-width { width: 100%; }
    .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    mat-form-field { width: 100%; }
  `]
})
export class LeaveRequestDialogComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<LeaveRequestDialogComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      leaveType: ['annual', Validators.required],
      startDate: [null, Validators.required],
      endDate:   [null, Validators.required],
      reason:    ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    const employeeId = this.authService.currentUser()?.employeeId ?? '';

    this.leaveService.createLeaveRequest({ ...this.form.value, employeeId }).subscribe({
      next: () => {
        this.notificationService.success('Leave request submitted successfully.');
        this.dialogRef.close(true);
      },
      error: () => { this.submitting = false; }
    });
  }
}
