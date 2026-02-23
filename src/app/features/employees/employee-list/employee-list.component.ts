import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeeService } from '@core/services/employee.service';
import { DepartmentService } from '@core/services/department.service';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';
import { Employee, EmployeeFilter, EmploymentStatus } from '@core/models/employee.model';
import { Department } from '@core/models/department.model';
import { PaginationMeta } from '@core/models/api.model';
import { environment } from '@environments/environment';
import {
  DataTableComponent,
  TableColumn,
  TableAction
} from '@shared/components/data-table/data-table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DataTableComponent,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="Employees"
      subtitle="Manage your workforce"
      icon="people"
      [breadcrumbs]="[{ label: 'Home', route: '/dashboard' }, { label: 'Employees' }]">
      <button mat-flat-button color="primary" routerLink="new" *ngIf="isHrManager()">
        <mat-icon>person_add</mat-icon>
        Add Employee
      </button>
    </app-page-header>

    <!-- Filters -->
    <div class="filters-row">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search</mat-label>
        <input matInput [formControl]="searchCtrl" placeholder="Name, email, ID…">
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Department</mat-label>
        <mat-select [formControl]="departmentCtrl">
          <mat-option value="">All</mat-option>
          <mat-option *ngFor="let dept of departments()" [value]="dept.id">
            {{ dept.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select [formControl]="statusCtrl">
          <mat-option value="">All</mat-option>
          <mat-option value="active">Active</mat-option>
          <mat-option value="inactive">Inactive</mat-option>
          <mat-option value="on_leave">On Leave</mat-option>
          <mat-option value="terminated">Terminated</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <!-- Data table -->
    <app-data-table
      [columns]="columns"
      [dataSource]="employees()"
      [actions]="tableActions"
      [loading]="loading()"
      [pagination]="pagination()"
      (sortChange)="onSort($event)"
      (pageChange)="onPage($event)"
      (actionClick)="onAction($event)">
    </app-data-table>
  `,
  styles: [`
    .filters-row {
      display: flex; gap: 16px; flex-wrap: wrap;
      margin-bottom: 16px; align-items: center;
    }
    .search-field { flex: 1; min-width: 200px; }
  `]
})
export class EmployeeListComponent implements OnInit {
  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly loading = signal(false);
  readonly pagination = signal<PaginationMeta | undefined>(undefined);

  readonly isHrManager = this.authService.isHrManager;

  searchCtrl = new FormControl('');
  departmentCtrl = new FormControl('');
  statusCtrl = new FormControl('');

  private currentPage = 1;
  private currentSort = { sortBy: 'lastName', sortOrder: 'asc' as const };

  readonly columns: TableColumn[] = [
    { key: 'avatarUrl',        label: '',           type: 'avatar', width: '56px' },
    { key: 'employeeId',       label: 'ID',         sortable: true },
    { key: 'firstName',        label: 'First Name', sortable: true },
    { key: 'lastName',         label: 'Last Name',  sortable: true },
    { key: 'email',            label: 'Email',      sortable: true },
    { key: 'departmentName',   label: 'Department', sortable: true },
    { key: 'positionTitle',    label: 'Position' },
    {
      key: 'employmentStatus', label: 'Status', type: 'badge',
      badgeConfig: {
        active:     { color: '#4caf50', label: 'Active' },
        inactive:   { color: '#9e9e9e', label: 'Inactive' },
        on_leave:   { color: '#ff9800', label: 'On Leave' },
        terminated: { color: '#f44336', label: 'Terminated' }
      }
    },
    { key: 'startDate', label: 'Start Date', type: 'date', sortable: true }
  ];

  readonly tableActions: TableAction[] = [
    { icon: 'visibility', label: 'View',   action: 'view',   color: 'primary' },
    { icon: 'edit',       label: 'Edit',   action: 'edit',   color: 'accent' },
    {
      icon: 'delete', label: 'Delete', action: 'delete', color: 'warn',
      visibleWhen: () => this.authService.isHrManager()
    }
  ];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();

    // React to search input with debounce
    this.searchCtrl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 1;
      this.loadEmployees();
    });

    // React to filter changes immediately
    this.departmentCtrl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadEmployees();
    });
    this.statusCtrl.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    this.loading.set(true);
    const filter: EmployeeFilter = {
      search: this.searchCtrl.value || undefined,
      departmentId: this.departmentCtrl.value || undefined,
      employmentStatus: (this.statusCtrl.value as EmploymentStatus) || undefined
    };

    this.employeeService
      .getEmployees(filter, {
        page: this.currentPage,
        pageSize: environment.pagination.defaultPageSize,
        ...this.currentSort
      })
      .subscribe({
        next: (res) => {
          this.employees.set(res.data);
          this.pagination.set(res.meta);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  loadDepartments(): void {
    this.departmentService
      .getDepartments({ pageSize: 100 })
      .subscribe((res) => this.departments.set(res.data));
  }

  onSort(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.currentSort = { sortBy: sort.active, sortOrder: sort.direction as 'asc' | 'desc' };
    }
    this.loadEmployees();
  }

  onPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadEmployees();
  }

  onAction(event: { action: string; row: unknown }): void {
    const employee = event.row as Employee;
    switch (event.action) {
      case 'view':   window.location.href = `/employees/${employee.id}`; break;
      case 'edit':   window.location.href = `/employees/${employee.id}/edit`; break;
      case 'delete': this.confirmDelete(employee); break;
    }
  }

  private confirmDelete(employee: Employee): void {
    const data: ConfirmDialogData = {
      title: 'Delete Employee',
      message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      icon: 'warning',
      confirmColor: 'warn'
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '400px' })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.employeeService.deleteEmployee(employee.id).subscribe({
            next: () => {
              this.notificationService.success('Employee deleted successfully.');
              this.loadEmployees();
            }
          });
        }
      });
  }
}
