import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeSummary } from '../../core/models/employee.model';
import { SharedModule } from '../../shared/shared.module';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockSummary: EmployeeSummary = {
    totalEmployees: 120,
    activeEmployees: 110,
    onLeaveEmployees: 5,
    newHiresThisMonth: 8,
    departmentBreakdown: [
      { departmentName: 'Engineering', count: 60 },
      { departmentName: 'HR', count: 20 },
    ],
    employmentTypeBreakdown: [
      { type: 'full_time', count: 100 },
      { type: 'contractor', count: 20 },
    ],
  };

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getSummary']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUser: {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      },
    });

    mockEmployeeService.getSummary.and.returnValue(
      of({ data: mockSummary, timestamp: '' }),
    );

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load summary data on init', () => {
    expect(mockEmployeeService.getSummary).toHaveBeenCalled();
    expect(component.summary).toEqual(mockSummary);
    expect(component.isLoading).toBeFalse();
  });

  it('should display correct stat values', () => {
    expect(component.getSummaryValue('totalEmployees')).toBe(120);
    expect(component.getSummaryValue('activeEmployees')).toBe(110);
  });

  it('should return 0 for getSummaryValue when no summary loaded', () => {
    component.summary = null;
    expect(component.getSummaryValue('totalEmployees')).toBe(0);
  });

  it('should handle summary load error', () => {
    mockEmployeeService.getSummary.and.returnValue(
      throwError(() => new Error('Server error')),
    );
    component.loadSummary();
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should return correct greeting based on time of day', () => {
    const greeting = component.greeting;
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting);
  });
});
