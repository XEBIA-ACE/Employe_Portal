import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SharedModule } from '../../../shared/shared.module';
import { Employee } from '../../../core/models/employee.model';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockDepartmentService: jasmine.SpyObj<DepartmentService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  const mockEmployee: Employee = {
    id: 'emp-1',
    employeeId: 'EMP-00001',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    jobTitle: 'Engineer',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    employmentType: 'full_time',
    employmentStatus: 'active',
    startDate: '2022-01-01',
    createdAt: '',
    updatedAt: '',
  };

  const paginationMock = {
    page: 1,
    pageSize: 20,
    totalItems: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [
      'getEmployees',
      'deleteEmployee',
      'exportCsv',
    ]);
    mockDepartmentService = jasmine.createSpyObj('DepartmentService', [
      'getDepartments',
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'warning',
    ]);

    mockEmployeeService.getEmployees.and.returnValue(
      of({ data: [mockEmployee], pagination: paginationMock, timestamp: '' }),
    );
    mockDepartmentService.getDepartments.and.returnValue(
      of({ data: [], pagination: paginationMock, timestamp: '' }),
    );

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: DepartmentService, useValue: mockDepartmentService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees.length).toBe(1);
    expect(component.employees[0]).toEqual(mockEmployee);
  });

  it('should show loading state initially', () => {
    // Re-create component to test initial loading state
    component.isLoading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table')).toBeNull();
  });

  it('should display employees after loading', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table')).toBeTruthy();
  });

  it('should show empty state when no employees found', () => {
    mockEmployeeService.getEmployees.and.returnValue(
      of({ data: [], pagination: { ...paginationMock, totalItems: 0 }, timestamp: '' }),
    );
    component.loadEmployees();
    fixture.detectChanges();
    expect(component.employees.length).toBe(0);
  });

  it('should handle load error gracefully', () => {
    mockEmployeeService.getEmployees.and.returnValue(
      throwError(() => new Error('Network error')),
    );
    component.loadEmployees();
    fixture.detectChanges();
    expect(mockNotificationService.error).toHaveBeenCalled();
  });

  it('should track employees by id', () => {
    expect(component.trackByEmployee(0, mockEmployee)).toBe('emp-1');
  });

  it('should toggle sort direction on repeated sort by same column', () => {
    component.filters = { sortBy: 'lastName', sortDirection: 'asc' };
    component.onSort('lastName');
    expect(component.filters.sortDirection).toBe('desc');

    component.onSort('lastName');
    expect(component.filters.sortDirection).toBe('asc');
  });
});
