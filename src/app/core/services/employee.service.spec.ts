import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { environment } from '@environments/environment';
import { Employee } from '@core/models/employee.model';
import { PaginatedResponse } from '@core/models/api.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const mockEmployee: Employee = {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    positionId: 'pos-1',
    positionTitle: 'Software Engineer',
    employmentType: 'full_time',
    employmentStatus: 'active',
    startDate: new Date('2023-01-01'),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPaginatedResponse: PaginatedResponse<Employee> = {
    data: [mockEmployee],
    meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmployees()', () => {
    it('should fetch paginated employees', () => {
      service.getEmployees().subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].employeeId).toBe('EMP001');
        expect(res.meta.total).toBe(1);
      });

      const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/employees`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should pass filter params to the API', () => {
      service.getEmployees({ departmentId: 'dept-1', employmentStatus: 'active' }).subscribe();

      const req = httpMock.expectOne((r) =>
        r.url === `${environment.apiUrl}/employees` &&
        r.params.get('departmentId') === 'dept-1' &&
        r.params.get('employmentStatus') === 'active'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getEmployee()', () => {
    it('should fetch a single employee by id', () => {
      service.getEmployee('1').subscribe((res) => {
        expect(res.data.id).toBe('1');
        expect(res.data.firstName).toBe('Jane');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockEmployee });
    });
  });

  describe('createEmployee()', () => {
    it('should POST to create an employee', () => {
      const payload = {
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@example.com',
        departmentId: 'dept-1',
        positionId: 'pos-1',
        employmentType: 'full_time' as const,
        startDate: new Date()
      };

      service.createEmployee(payload).subscribe((res) => {
        expect(res.data.firstName).toBe('Jane');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/employees`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ data: mockEmployee });
    });
  });

  describe('deleteEmployee()', () => {
    it('should DELETE an employee by id', () => {
      service.deleteEmployee('1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/employees/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: null });
    });
  });
});
