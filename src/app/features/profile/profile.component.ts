import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import { Employee } from '../../core/models/employee.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;
  isEditing = false;
  isSaving = false;
  editForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.buildEditForm();
    this.loadProfile();
  }

  private buildEditForm(): void {
    this.editForm = this.fb.group({
      phone: [''],
      bio: [''],
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],
    });
  }

  private loadProfile(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.employeeService.getEmployee(userId).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.populateEditForm(emp);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private populateEditForm(emp: Employee): void {
    this.editForm.patchValue({
      phone: emp.phone ?? '',
      bio: emp.bio ?? '',
      street: emp.address?.street ?? '',
      city: emp.address?.city ?? '',
      state: emp.address?.state ?? '',
      zipCode: emp.address?.zipCode ?? '',
      country: emp.address?.country ?? '',
    });
  }

  get initials(): string {
    if (!this.employee) return '?';
    return `${this.employee.firstName[0]}${this.employee.lastName[0]}`.toUpperCase();
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    if (this.employee) {
      this.populateEditForm(this.employee);
    }
    this.isEditing = false;
  }

  saveProfile(): void {
    if (!this.employee) return;

    this.isSaving = true;
    const raw = this.editForm.value;

    const updates = {
      phone: raw.phone || undefined,
      bio: raw.bio || undefined,
      address: raw.street ? {
        street: raw.street,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
        country: raw.country,
      } : undefined,
    };

    this.employeeService
      .updateEmployee(this.employee.id, updates)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (updated) => {
          this.employee = updated;
          this.isEditing = false;
          this.notification.success('Profile updated successfully.');
        },
      });
  }
}
