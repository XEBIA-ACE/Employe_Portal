import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Department, EmployeeStatus, EmploymentType, Gender } from '../../../core/models/employee.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly notification = inject(NotificationService);

  isEditMode = false;
  employeeId: string | null = null;
  isLoading = false;
  isLoadingEmployee = false;
  departments: Department[] = [];

  statusOptions: { label: string; value: EmployeeStatus }[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on-leave' },
    { label: 'Terminated', value: 'terminated' },
  ];

  employmentTypes: { label: string; value: EmploymentType }[] = [
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Intern', value: 'intern' },
  ];

  genderOptions: { label: string; value: Gender }[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' },
  ];

  // Step 1: Personal info
  personalForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    dateOfBirth: [''],
    gender: [''],
  });

  // Step 2: Employment info
  employmentForm: FormGroup = this.fb.group({
    jobTitle: ['', Validators.required],
    departmentId: ['', Validators.required],
    managerId: [''],
    employmentType: ['full-time' as EmploymentType, Validators.required],
    status: ['active' as EmployeeStatus, Validators.required],
    hireDate: ['', Validators.required],
    salary: [null],
    currency: ['USD'],
  });

  // Step 3: Address & emergency contact
  contactForm: FormGroup = this.fb.group({
    street: [''],
    city: [''],
    state: [''],
    country: [''],
    postalCode: [''],
    ecName: [''],
    ecRelationship: [''],
    ecPhone: [''],
    ecEmail: [''],
  });

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.employeeId;
    this.loadDepartments();

    if (this.isEditMode) {
      this.loadEmployee();
    }
  }

  private loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (res) => (this.departments = res.data),
    });
  }

  private loadEmployee(): void {
    this.isLoadingEmployee = true;
    this.employeeService.getEmployeeById(this.employeeId!).subscribe({
      next: (res) => {
        const e = res.data;
        this.personalForm.patchValue({
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          phone: e.phone,
          dateOfBirth: e.dateOfBirth,
          gender: e.gender,
        });
        this.employmentForm.patchValue({
          jobTitle: e.jobTitle,
          departmentId: e.departmentId,
          managerId: e.managerId,
          employmentType: e.employmentType,
          status: e.status,
          hireDate: e.hireDate,
          salary: e.salary,
          currency: e.currency,
        });
        if (e.address) {
          this.contactForm.patchValue({
            street: e.address.street,
            city: e.address.city,
            state: e.address.state,
            country: e.address.country,
            postalCode: e.address.postalCode,
          });
        }
        if (e.emergencyContact) {
          this.contactForm.patchValue({
            ecName: e.emergencyContact.name,
            ecRelationship: e.emergencyContact.relationship,
            ecPhone: e.emergencyContact.phone,
            ecEmail: e.emergencyContact.email,
          });
        }
        this.isLoadingEmployee = false;
      },
      error: () => {
        this.isLoadingEmployee = false;
        this.router.navigate(['/employees']);
      },
    });
  }

  onSubmit(): void {
    if (this.personalForm.invalid || this.employmentForm.invalid) {
      this.personalForm.markAllAsTouched();
      this.employmentForm.markAllAsTouched();
      return;
    }

    const cv = this.contactForm.value;
    const payload = {
      ...this.personalForm.value,
      ...this.employmentForm.value,
      address: cv.street
        ? {
            street: cv.street,
            city: cv.city,
            state: cv.state,
            country: cv.country,
            postalCode: cv.postalCode,
          }
        : undefined,
      emergencyContact: cv.ecName
        ? {
            name: cv.ecName,
            relationship: cv.ecRelationship,
            phone: cv.ecPhone,
            email: cv.ecEmail,
          }
        : undefined,
    };

    this.isLoading = true;
    const request = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId!, payload)
      : this.employeeService.createEmployee(payload);

    request.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.notification.success(
          this.isEditMode ? 'Employee updated successfully.' : 'Employee created successfully.',
        );
        this.router.navigate(['/employees', res.data.id]);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.isEditMode ? `/employees/${this.employeeId}` : '/employees']);
  }
}
