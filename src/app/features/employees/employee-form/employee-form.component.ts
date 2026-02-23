import { Component, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { EmployeeService } from '@core/services/employee.service';
import { DepartmentService } from '@core/services/department.service';
import { NotificationService } from '@core/services/notification.service';
import { Department, Position } from '@core/models/department.model';
import { Employee } from '@core/models/employee.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      [title]="isEdit ? 'Edit Employee' : 'Add Employee'"
      [subtitle]="isEdit ? 'Update employee information' : 'Create a new employee record'"
      icon="person"
      [breadcrumbs]="[
        { label: 'Home', route: '/dashboard' },
        { label: 'Employees', route: '/employees' },
        { label: isEdit ? 'Edit' : 'Add' }
      ]">
    </app-page-header>

    <mat-card>
      <mat-card-content>
        <mat-stepper linear #stepper>
          <!-- Step 1: Personal Info -->
          <mat-step [stepControl]="personalForm" label="Personal Information">
            <form [formGroup]="personalForm" class="step-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name *</mat-label>
                  <input matInput formControlName="firstName">
                  <mat-error *ngIf="personalForm.get('firstName')?.hasError('required')">Required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Last Name *</mat-label>
                  <input matInput formControlName="lastName">
                  <mat-error *ngIf="personalForm.get('lastName')?.hasError('required')">Required</mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Email Address *</mat-label>
                  <input matInput type="email" formControlName="email">
                  <mat-error *ngIf="personalForm.get('email')?.hasError('required')">Required</mat-error>
                  <mat-error *ngIf="personalForm.get('email')?.hasError('email')">Invalid email</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phone">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Date of Birth</mat-label>
                  <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth">
                  <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
                  <mat-datepicker #dobPicker></mat-datepicker>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Gender</mat-label>
                  <mat-select formControlName="gender">
                    <mat-option value="male">Male</mat-option>
                    <mat-option value="female">Female</mat-option>
                    <mat-option value="other">Other</mat-option>
                    <mat-option value="prefer_not_to_say">Prefer not to say</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-flat-button color="primary" matStepperNext [disabled]="personalForm.invalid">
                  Next <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Employment Info -->
          <mat-step [stepControl]="employmentForm" label="Employment Details">
            <form [formGroup]="employmentForm" class="step-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Department *</mat-label>
                  <mat-select formControlName="departmentId" (selectionChange)="onDepartmentChange()">
                    <mat-option *ngFor="let dept of departments()" [value]="dept.id">
                      {{ dept.name }}
                    </mat-option>
                  </mat-select>
                  <mat-error>Required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Position *</mat-label>
                  <mat-select formControlName="positionId">
                    <mat-option *ngFor="let pos of positions()" [value]="pos.id">
                      {{ pos.title }}
                    </mat-option>
                  </mat-select>
                  <mat-error>Required</mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Employment Type *</mat-label>
                  <mat-select formControlName="employmentType">
                    <mat-option value="full_time">Full Time</mat-option>
                    <mat-option value="part_time">Part Time</mat-option>
                    <mat-option value="contract">Contract</mat-option>
                    <mat-option value="intern">Intern</mat-option>
                  </mat-select>
                  <mat-error>Required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Start Date *</mat-label>
                  <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  <mat-error>Required</mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Salary</mat-label>
                  <input matInput type="number" formControlName="salary" min="0">
                  <span matPrefix>$&nbsp;</span>
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon> Back
                </button>
                <button mat-flat-button color="primary" matStepperNext [disabled]="employmentForm.invalid">
                  Next <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Review & Submit -->
          <mat-step label="Review & Submit">
            <div class="review-section">
              <h3>Personal Information</h3>
              <div class="review-grid">
                <div><label>Name</label><span>{{ personalForm.value.firstName }} {{ personalForm.value.lastName }}</span></div>
                <div><label>Email</label><span>{{ personalForm.value.email }}</span></div>
                <div><label>Phone</label><span>{{ personalForm.value.phone || '—' }}</span></div>
                <div><label>Gender</label><span>{{ personalForm.value.gender | titlecase }}</span></div>
              </div>

              <h3>Employment Details</h3>
              <div class="review-grid">
                <div><label>Employment Type</label><span>{{ employmentForm.value.employmentType | titlecase }}</span></div>
                <div><label>Start Date</label><span>{{ employmentForm.value.startDate | date }}</span></div>
                <div><label>Salary</label><span>{{ employmentForm.value.salary | currency }}</span></div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Back
              </button>
              <button
                mat-flat-button color="primary"
                (click)="onSubmit()"
                [disabled]="submitting()">
                <mat-spinner *ngIf="submitting()" diameter="20"></mat-spinner>
                <span *ngIf="!submitting()">
                  <mat-icon>save</mat-icon> {{ isEdit ? 'Update' : 'Create' }} Employee
                </span>
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { border-radius: 12px; }
    .step-form { padding: 16px 0; }
    .form-row {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 16px; margin-bottom: 8px;
    }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
    mat-form-field { width: 100%; }
    .step-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
    .review-section h3 { margin: 16px 0 8px; color: rgba(0,0,0,.6); font-size: 0.875rem; text-transform: uppercase; }
    .review-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px; background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;
    }
    .review-grid div { display: flex; flex-direction: column; }
    .review-grid label { font-size: 0.75rem; color: rgba(0,0,0,.5); margin-bottom: 2px; }
    .review-grid span { font-size: 0.9rem; font-weight: 500; }
  `]
})
export class EmployeeFormComponent implements OnInit {
  @Input() employeeId?: string;

  readonly departments = signal<Department[]>([]);
  readonly positions = signal<Position[]>([]);
  readonly submitting = signal(false);

  personalForm!: FormGroup;
  employmentForm!: FormGroup;

  get isEdit(): boolean {
    return !!this.employeeId;
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      firstName:   ['', [Validators.required, Validators.maxLength(50)]],
      lastName:    ['', [Validators.required, Validators.maxLength(50)]],
      email:       ['', [Validators.required, Validators.email]],
      phone:       [''],
      dateOfBirth: [null],
      gender:      ['']
    });

    this.employmentForm = this.fb.group({
      departmentId:   ['', Validators.required],
      positionId:     ['', Validators.required],
      employmentType: ['full_time', Validators.required],
      startDate:      [new Date(), Validators.required],
      salary:         [null, [Validators.min(0)]]
    });

    this.departmentService.getDepartments({ pageSize: 100 }).subscribe((res) => {
      this.departments.set(res.data);
    });

    if (this.isEdit) {
      this.loadEmployee();
    }
  }

  onDepartmentChange(): void {
    const deptId = this.employmentForm.get('departmentId')?.value;
    if (deptId) {
      this.departmentService.getPositions(deptId).subscribe((res) => {
        this.positions.set(res.data);
        this.employmentForm.get('positionId')?.setValue('');
      });
    }
  }

  onSubmit(): void {
    if (this.personalForm.invalid || this.employmentForm.invalid) return;

    this.submitting.set(true);
    const payload = { ...this.personalForm.value, ...this.employmentForm.value };

    const request = this.isEdit
      ? this.employeeService.updateEmployee(this.employeeId!, payload)
      : this.employeeService.createEmployee(payload);

    request.subscribe({
      next: () => {
        this.notificationService.success(
          this.isEdit ? 'Employee updated successfully.' : 'Employee created successfully.'
        );
        this.router.navigate(['/employees']);
      },
      error: () => this.submitting.set(false)
    });
  }

  private loadEmployee(): void {
    this.employeeService.getEmployee(this.employeeId!).subscribe({
      next: (res) => {
        const e: Employee = res.data;
        this.personalForm.patchValue({
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          phone: e.phone,
          dateOfBirth: e.dateOfBirth,
          gender: e.gender
        });
        this.employmentForm.patchValue({
          departmentId: e.departmentId,
          positionId: e.positionId,
          employmentType: e.employmentType,
          startDate: e.startDate,
          salary: e.salary
        });
        this.onDepartmentChange();
      }
    });
  }
}
