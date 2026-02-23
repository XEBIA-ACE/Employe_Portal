import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { DepartmentService } from '@core/services/department.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { Department, CreateDepartmentRequest } from '@core/models/department.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="Departments"
      subtitle="Manage organizational departments"
      icon="business"
      [breadcrumbs]="[{ label: 'Home', route: '/dashboard' }, { label: 'Departments' }]">
      <button mat-flat-button color="primary" (click)="openForm()" *ngIf="isAdmin()">
        <mat-icon>add</mat-icon> Add Department
      </button>
    </app-page-header>

    <!-- Loading -->
    <div class="loading-center" *ngIf="loading()">
      <mat-spinner></mat-spinner>
    </div>

    <!-- Department grid -->
    <div class="dept-grid" *ngIf="!loading()">
      <mat-card
        *ngFor="let dept of departments()"
        class="dept-card mat-elevation-z2"
        [class.inactive]="!dept.isActive">
        <mat-card-content>
          <div class="dept-header">
            <div class="dept-icon">
              <mat-icon>business</mat-icon>
            </div>
            <div class="dept-actions" *ngIf="isAdmin()">
              <button mat-icon-button (click)="openForm(dept)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(dept)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>

          <h3 class="dept-name">{{ dept.name }}</h3>
          <p class="dept-code">{{ dept.code }}</p>
          <p class="dept-desc" *ngIf="dept.description">{{ dept.description }}</p>

          <div class="dept-stats">
            <div class="stat">
              <mat-icon>people</mat-icon>
              <span>{{ dept.employeeCount ?? 0 }} employees</span>
            </div>
            <div class="stat" *ngIf="dept.managerName">
              <mat-icon>manage_accounts</mat-icon>
              <span>{{ dept.managerName }}</span>
            </div>
          </div>

          <mat-chip-set>
            <mat-chip [color]="dept.isActive ? 'primary' : 'warn'" highlighted>
              {{ dept.isActive ? 'Active' : 'Inactive' }}
            </mat-chip>
          </mat-chip-set>
        </mat-card-content>
      </mat-card>

      <div class="empty-state" *ngIf="departments().length === 0">
        <mat-icon>business</mat-icon>
        <p>No departments found.</p>
      </div>
    </div>

    <!-- Inline form dialog overlay (simplified) -->
    <div class="form-overlay" *ngIf="showForm()">
      <mat-card class="form-card mat-elevation-z8">
        <mat-card-header>
          <mat-card-title>{{ editingDept() ? 'Edit' : 'Add' }} Department</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="deptForm" class="dept-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name *</mat-label>
              <input matInput formControlName="name">
              <mat-error>Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Code *</mat-label>
              <input matInput formControlName="code" placeholder="e.g. ENG, HR, MKT">
              <mat-error>Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="closeForm()">Cancel</button>
          <button mat-flat-button color="primary" (click)="submitForm()" [disabled]="deptForm.invalid || submitting()">
            <mat-spinner *ngIf="submitting()" diameter="18"></mat-spinner>
            <span *ngIf="!submitting()">{{ editingDept() ? 'Update' : 'Create' }}</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .loading-center { display: flex; justify-content: center; padding: 64px; }
    .dept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .dept-card { border-radius: 12px; transition: box-shadow 0.2s; }
    .dept-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.15) !important; }
    .dept-card.inactive { opacity: 0.6; }
    .dept-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .dept-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #3f51b5, #7c4dff);
      display: flex; align-items: center; justify-content: center;
    }
    .dept-icon mat-icon { color: #fff; }
    .dept-actions { display: flex; }
    .dept-name { margin: 0 0 4px; font-size: 1.1rem; font-weight: 600; }
    .dept-code { margin: 0 0 8px; font-size: 0.75rem; color: rgba(0,0,0,.4); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .dept-desc { margin: 0 0 12px; font-size: 0.875rem; color: rgba(0,0,0,.5); line-height: 1.4; }
    .dept-stats { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .stat { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: rgba(0,0,0,.6); }
    .stat mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 48px; color: rgba(0,0,0,.4); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
    .form-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.4);
      display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    .form-card { width: 100%; max-width: 480px; border-radius: 12px; }
    .dept-form { padding: 8px 0; display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
  `]
})
export class DepartmentsComponent implements OnInit {
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly showForm = signal(false);
  readonly editingDept = signal<Department | null>(null);
  readonly isAdmin = this.authService.isAdmin;

  deptForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.departmentService.getDepartments({ pageSize: 100 }, true).subscribe({
      next: (res) => { this.departments.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openForm(dept?: Department): void {
    this.editingDept.set(dept ?? null);
    if (dept) {
      this.deptForm.patchValue({ name: dept.name, code: dept.code, description: dept.description });
    } else {
      this.deptForm.reset();
    }
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingDept.set(null);
    this.deptForm.reset();
  }

  submitForm(): void {
    if (this.deptForm.invalid) return;
    this.submitting.set(true);

    const payload: CreateDepartmentRequest = this.deptForm.value;
    const editing = this.editingDept();

    const request = editing
      ? this.departmentService.updateDepartment(editing.id, payload)
      : this.departmentService.createDepartment(payload);

    request.subscribe({
      next: () => {
        this.notificationService.success(editing ? 'Department updated.' : 'Department created.');
        this.closeForm();
        this.loadDepartments();
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  confirmDelete(dept: Department): void {
    const data: ConfirmDialogData = {
      title: 'Delete Department',
      message: `Delete the "${dept.name}" department? This cannot be undone.`,
      confirmLabel: 'Delete',
      icon: 'warning',
      confirmColor: 'warn'
    };

    this.dialog.open(ConfirmDialogComponent, { data, width: '400px' })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.departmentService.deleteDepartment(dept.id).subscribe({
            next: () => {
              this.notificationService.success('Department deleted.');
              this.loadDepartments();
            }
          });
        }
      });
  }

  private initForm(): void {
    this.deptForm = this.fb.group({
      name:        ['', [Validators.required, Validators.maxLength(100)]],
      code:        ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[A-Z0-9_]+$/i)]],
      description: ['', Validators.maxLength(500)]
    });
  }
}
