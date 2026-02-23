import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee, EmploymentStatus } from '../../../core/models/employee.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['avatar', 'employeeId', 'name', 'jobTitle', 'department', 'status', 'hireDate', 'actions'];
  dataSource = new MatTableDataSource<Employee>();
  isLoading = true;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly EmploymentStatus = EmploymentStatus;
  readonly UserRole = UserRole;

  constructor(
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configure custom sort for nested fields
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': return `${item.firstName} ${item.lastName}`;
        default: return (item as Record<string, unknown>)[property] as string;
      }
    };
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees({ limit: 100 }).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.dataSource.filter = term.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInitials(employee: Employee): string {
    return `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();
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

  viewEmployee(id: string): void {
    this.router.navigate(['/employees', id]);
  }

  editEmployee(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(employee: Employee, event: Event): void {
    event.stopPropagation();

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.notification.success(`${employee.firstName} ${employee.lastName} has been deleted.`);
          this.loadEmployees();
        },
      });
    });
  }
}
