import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';
import { environment } from '../../../environments/environment';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const mockEmployee: Employee = {
    id: 'emp-1',
    employeeId: 'EMP-00001',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    jobTitle: 'Software Engineer',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    employmentType: 'full_time',
    employmentStatus: 'active',
    startDate: '2022-01-15',
    createdAt: '2022-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService],
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmployees()', () => {
    it('should GET /employees with no params by default', () => {
      const mockResponse = {
        data: [mockEmployee],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        timestamp: new Date().toISOString(),
      };

      service.getEmployees().subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0]).toEqual(mockEmployee);
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/employees`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include filter params in the request', () => {
      service
        .getEmployees({ search: 'Jane', departmentId: 'dept-1', page: 2 })
        .subscribe();

      const req = httpMock.expectOne((r) =>
        r.url === `${environment.apiBaseUrl}/employees`,
      );

      expect(req.request.params.get('search')).toBe('Jane');
      expect(req.request.params.get('departmentId')).toBe('dept-1');
      expect(req.request.params.get('page')).toBe('2');
      req.flush({ data: [], pagination: {}, timestamp: '' });
    });
  });

  describe('getEmployee()', () => {
    it('should GET a single employee by id', () => {
      const mockResponse = {
        data: mockEmployee,
        timestamp: new Date().toISOString(),
      };

      service.getEmployee('emp-1').subscribe((res) => {
        expect(res.data).toEqual(mockEmployee);
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/employees/emp-1`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createEmployee()', () => {
    it('should POST new employee data', () => {
      const payload = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        jobTitle: 'Engineer',
        departmentId: 'dept-1',
        employmentType: 'full_time' as const,
        startDate: '2024-01-01',
      };
      const mockResponse = { data: mockEmployee, timestamp: '' };

      service.createEmployee(payload).subscribe((res) => {
        expect(res.data).toEqual(mockEmployee);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/employees`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });

  describe('deleteEmployee()', () => {
    it('should DELETE an employee', () => {
      service.deleteEmployee('emp-1').subscribe();
      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/employees/emp-1`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: null, timestamp: '' });
    });
  });
});
