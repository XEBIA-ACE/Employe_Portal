import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  Employee,
  EmployeeFilters,
  EmploymentStatus,
} from '../../../core/models/employee.model';
import { Department } from '../../../core/models/department.model';
import { Pagination } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  departments: Department[] = [];
  pagination: Pagination | null = null;
  isLoading = true;
  deleteInProgress: string | null = null;

  // Filters
  searchControl = new FormControl('');
  filters: EmployeeFilters = { page: 1, pageSize: 20, sortBy: 'lastName', sortDirection: 'asc' };

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Data Loading ─────────────────────────────────────────────────────────

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService
      .getEmployees(this.filters)
      .pipe(
        catchError(() => {
          this.notificationService.error('Failed to load employees.');
          return of(null);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((response) => {
        if (response) {
          this.employees = response.data;
          this.pagination = response.pagination;
        }
        this.isLoading = false;
      });
  }

  loadDepartments(): void {
    this.departmentService
      .getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => (this.departments = res.data),
        error: () => {},
      });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => {
        this.filters = { ...this.filters, search: value ?? '', page: 1 };
        this.loadEmployees();
      });
  }

  // ─── Filtering & Sorting ──────────────────────────────────────────────────

  onDepartmentChange(departmentId: string): void {
    this.filters = { ...this.filters, departmentId: departmentId || undefined, page: 1 };
    this.loadEmployees();
  }

  onStatusChange(status: string): void {
    this.filters = {
      ...this.filters,
      employmentStatus: (status as EmploymentStatus) || undefined,
      page: 1,
    };
    this.loadEmployees();
  }

  onSort(column: keyof Employee): void {
    const direction =
      this.filters.sortBy === column && this.filters.sortDirection === 'asc'
        ? 'desc'
        : 'asc';
    this.filters = { ...this.filters, sortBy: column, sortDirection: direction };
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    this.filters = { ...this.filters, page };
    this.loadEmployees();
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  editEmployee(id: string): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees', id]);
  }

  deleteEmployee(employee: Employee): void {
    if (!confirm(`Delete ${employee.firstName} ${employee.lastName}? This cannot be undone.`)) {
      return;
    }

    this.deleteInProgress = employee.id;
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Employee deleted',
          `${employee.firstName} ${employee.lastName} has been removed.`,
        );
        this.employees = this.employees.filter((e) => e.id !== employee.id);
        this.deleteInProgress = null;
      },
      error: () => {
        this.deleteInProgress = null;
      },
    });
  }

  exportCsv(): void {
    this.employeeService.exportCsv(this.filters).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  trackByEmployee(_index: number, employee: Employee): string {
    return employee.id;
  }

  getSortIcon(column: string): string {
    if (this.filters.sortBy !== column) return '⇅';
    return this.filters.sortDirection === 'asc' ? '↑' : '↓';
  }

  get pageNumbers(): number[] {
    if (!this.pagination) return [];
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }
}
