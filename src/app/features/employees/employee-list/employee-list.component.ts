import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  EmployeeListItem,
  EmployeeFilter,
  EmployeeStatus,
  Department,
} from '../../../core/models/employee.model';
import { PaginationParams } from '../../../core/models/api-response.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly employeeService = inject(EmployeeService);
  private readonly notificationService = inject(NotificationService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();

  displayedColumns = [
    'avatar',
    'employeeId',
    'name',
    'jobTitle',
    'department',
    'status',
    'employmentType',
    'hireDate',
    'actions',
  ];

  dataSource = new MatTableDataSource<EmployeeListItem>([]);
  isLoading = true;
  totalRecords = 0;
  departments: Department[] = [];

  // Filter controls
  searchControl = new FormControl('');
  departmentControl = new FormControl('');
  statusControl = new FormControl<EmployeeStatus | ''>('');

  statusOptions: { label: string; value: EmployeeStatus }[] = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'On Leave', value: 'on-leave' },
    { label: 'Terminated', value: 'terminated' },
  ];

  private pagination: PaginationParams = {
    page: 1,
    pageSize: 10,
    sortBy: 'lastName',
    sortOrder: 'asc',
  };

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
    this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pagination.page = 1;
        this.loadEmployees();
      });
  }

  loadEmployees(): void {
    this.isLoading = true;
    const filters: EmployeeFilter = {
      search: this.searchControl.value ?? undefined,
      departmentId: this.departmentControl.value ?? undefined,
      status: (this.statusControl.value as EmployeeStatus) || undefined,
    };

    this.employeeService.getEmployees(this.pagination, filters).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalRecords = response.pagination.total;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.loadEmployees();
  }

  onSortChange(sort: Sort): void {
    this.pagination.sortBy = sort.active;
    this.pagination.sortOrder = sort.direction as 'asc' | 'desc';
    this.pagination.page = 1;
    this.loadEmployees();
  }

  onFilterChange(): void {
    this.pagination.page = 1;
    this.loadEmployees();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.departmentControl.setValue('');
    this.statusControl.setValue('');
    this.pagination.page = 1;
    this.loadEmployees();
  }

  onRowClick(employee: EmployeeListItem): void {
    this.router.navigate(['/employees', employee.id]);
  }

  onDeleteEmployee(employee: EmployeeListItem, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn',
        icon: 'delete_forever',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.notificationService.success('Employee deleted successfully.');
            this.loadEmployees();
          },
        });
      }
    });
  }

  onExport(format: 'csv' | 'xlsx'): void {
    const filters: EmployeeFilter = {
      departmentId: this.departmentControl.value ?? undefined,
      status: (this.statusControl.value as EmployeeStatus) || undefined,
    };

    this.employeeService.exportEmployees(format, filters).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `employees.${format}`;
        link.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  getInitials(employee: EmployeeListItem): string {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.searchControl.value ||
      this.departmentControl.value ||
      this.statusControl.value
    );
  }
}
