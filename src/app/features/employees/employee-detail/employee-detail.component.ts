import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee, EmploymentStatus } from '../../../core/models/employee.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;

  readonly UserRole = UserRole;
  readonly EmploymentStatus = EmploymentStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  private loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/employees']);
      },
    });
  }

  get initials(): string {
    if (!this.employee) return '?';
    return `${this.employee.firstName[0]}${this.employee.lastName[0]}`.toUpperCase();
  }

  getStatusClass(status: EmploymentStatus): string {
    const map: Record<EmploymentStatus, string> = {
      [EmploymentStatus.ACTIVE]: 'status-active',
      [EmploymentStatus.INACTIVE]: 'status-inactive',
      [EmploymentStatus.ON_LEAVE]: 'status-warning',
      [EmploymentStatus.TERMINATED]: 'status-danger',
    };
    return map[status] ?? '';
  }

  getStatusLabel(status: EmploymentStatus): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  formatEnum(value: string): string {
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  editEmployee(): void {
    this.router.navigate(['/employees', this.employee!.id, 'edit']);
  }

  deleteEmployee(): void {
    if (!this.employee) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${this.employee.firstName} ${this.employee.lastName}?`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.employeeService.deleteEmployee(this.employee!.id).subscribe({
        next: () => {
          this.notification.success('Employee deleted successfully.');
          this.router.navigate(['/employees']);
        },
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
