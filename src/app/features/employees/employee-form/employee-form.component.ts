import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Department } from '../../../core/models/department.model';
import { EmploymentStatus, EmploymentType, Gender } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  employeeId: string | null = null;
  departments: Department[] = [];

  // Enum references for template
  readonly EmploymentStatus = EmploymentStatus;
  readonly EmploymentType = EmploymentType;
  readonly Gender = Gender;

  readonly statusOptions = Object.values(EmploymentStatus);
  readonly typeOptions = Object.values(EmploymentType);
  readonly genderOptions = Object.values(Gender);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadDepartments();

    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      // Personal
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      dateOfBirth: [''],
      gender: [''],

      // Employment
      employeeId: ['', Validators.required],
      departmentId: ['', Validators.required],
      jobTitle: ['', [Validators.required, Validators.maxLength(100)]],
      managerId: [''],
      hireDate: ['', Validators.required],
      employmentStatus: [EmploymentStatus.ACTIVE, Validators.required],
      employmentType: [EmploymentType.FULL_TIME, Validators.required],
      salary: [null, [Validators.min(0)]],
      currency: ['USD'],

      // Address
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],

      // Other
      bio: [''],
    });
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  private loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone ?? '',
          dateOfBirth: employee.dateOfBirth ?? '',
          gender: employee.gender ?? '',
          employeeId: employee.employeeId,
          departmentId: employee.departmentId,
          jobTitle: employee.jobTitle,
          managerId: employee.managerId ?? '',
          hireDate: employee.hireDate,
          employmentStatus: employee.employmentStatus,
          employmentType: employee.employmentType,
          salary: employee.salary ?? null,
          currency: employee.currency ?? 'USD',
          street: employee.address?.street ?? '',
          city: employee.address?.city ?? '',
          state: employee.address?.state ?? '',
          zipCode: employee.address?.zipCode ?? '',
          country: employee.address?.country ?? '',
          bio: employee.bio ?? '',
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.goBack();
      },
    });
  }

  formatEnumLabel(value: string): string {
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const raw = this.form.value;

    const payload = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone || undefined,
      dateOfBirth: raw.dateOfBirth || undefined,
      gender: raw.gender || undefined,
      employeeId: raw.employeeId,
      departmentId: raw.departmentId,
      jobTitle: raw.jobTitle,
      managerId: raw.managerId || undefined,
      hireDate: raw.hireDate,
      employmentStatus: raw.employmentStatus,
      employmentType: raw.employmentType,
      salary: raw.salary ?? undefined,
      currency: raw.currency,
      bio: raw.bio || undefined,
      address: raw.street ? {
        street: raw.street,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
        country: raw.country,
      } : undefined,
    };

    const request$ = this.isEditMode && this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.createEmployee(payload as any);

    request$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (employee) => {
        const msg = this.isEditMode ? 'Employee updated successfully.' : 'Employee created successfully.';
        this.notification.success(msg);
        this.router.navigate(['/employees', employee.id]);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
