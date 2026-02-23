import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Department } from '../../../core/models/department.model';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  employee: Employee | null = null;
  departments: Department[] = [];
  isLoading = false;
  isSubmitting = false;

  readonly employmentTypes = [
    { value: 'full_time',   label: 'Full Time' },
    { value: 'part_time',   label: 'Part Time' },
    { value: 'contractor',  label: 'Contractor' },
    { value: 'intern',      label: 'Intern' },
  ];

  readonly employmentStatuses = [
    { value: 'active',     label: 'Active' },
    { value: 'on_leave',   label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'pending',    label: 'Pending' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.employeeId;

    this.buildForm();
    this.loadDepartments();

    if (this.isEditMode && this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  // ─── Form Setup ───────────────────────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group({
      // Personal Info
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName:  ['', [Validators.required, Validators.maxLength(100)]],
      email:     ['', [Validators.required, Validators.email]],
      phone:     ['', [Validators.pattern(/^\+?[\d\s\-().]{7,20}$/)]],

      // Employment
      jobTitle:       ['', [Validators.required, Validators.maxLength(100)]],
      departmentId:   ['', Validators.required],
      employmentType: ['full_time', Validators.required],
      startDate:      ['', Validators.required],
      location:       [''],
      salary:         [null, [Validators.min(0)]],
      currency:       ['USD'],

      // Status (edit mode only)
      employmentStatus: ['active'],
      endDate: [''],

      // Skills (comma-separated)
      skillsInput: [''],
      notes: ['', Validators.maxLength(2000)],
    });
  }

  // ─── Data Loading ─────────────────────────────────────────────────────────

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (res) => (this.departments = res.data),
    });
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        this.employee = res.data;
        this.patchForm(res.data);
        this.isLoading = false;
      },
      error: () => {
        this.notifications.error('Employee not found.');
        this.router.navigate(['/employees']);
      },
    });
  }

  private patchForm(emp: Employee): void {
    this.form.patchValue({
      firstName:        emp.firstName,
      lastName:         emp.lastName,
      email:            emp.email,
      phone:            emp.phone ?? '',
      jobTitle:         emp.jobTitle,
      departmentId:     emp.departmentId,
      employmentType:   emp.employmentType,
      startDate:        emp.startDate,
      location:         emp.location ?? '',
      salary:           emp.salary ?? null,
      currency:         emp.currency ?? 'USD',
      employmentStatus: emp.employmentStatus,
      endDate:          emp.endDate ?? '',
      skillsInput:      (emp.skills ?? []).join(', '),
      notes:            emp.notes ?? '',
    });
  }

  // ─── Form Submission ──────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notifications.warning('Please fix the validation errors before submitting.');
      return;
    }

    this.isSubmitting = true;
    const payload = this.buildPayload();

    const request$ = this.isEditMode && this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.createEmployee(payload);

    request$
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (res) => {
          const name = `${res.data.firstName} ${res.data.lastName}`;
          this.notifications.success(
            this.isEditMode ? 'Employee updated' : 'Employee created',
            name,
          );
          this.router.navigate(['/employees', res.data.id]);
        },
      });
  }

  private buildPayload(): Record<string, unknown> {
    const raw = this.form.value;
    const skills = raw.skillsInput
      ? raw.skillsInput.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    return {
      firstName:        raw.firstName,
      lastName:         raw.lastName,
      email:            raw.email,
      phone:            raw.phone || undefined,
      jobTitle:         raw.jobTitle,
      departmentId:     raw.departmentId,
      employmentType:   raw.employmentType,
      startDate:        raw.startDate,
      location:         raw.location || undefined,
      salary:           raw.salary || undefined,
      currency:         raw.currency || undefined,
      employmentStatus: raw.employmentStatus,
      endDate:          raw.endDate || undefined,
      skills:           skills.length ? skills : undefined,
      notes:            raw.notes || undefined,
    };
  }

  cancel(): void {
    if (this.isEditMode && this.employeeId) {
      this.router.navigate(['/employees', this.employeeId]);
    } else {
      this.router.navigate(['/employees']);
    }
  }

  // ─── Template Helpers ─────────────────────────────────────────────────────

  getControl(name: string): AbstractControl {
    return this.form.get(name)!;
  }

  isInvalid(name: string): boolean {
    const ctrl = this.getControl(name);
    return ctrl.invalid && ctrl.touched;
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Edit Employee' : 'Add New Employee';
  }
}
