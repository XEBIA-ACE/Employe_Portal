import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { environment } from '../../../environments/environment';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';
import { EmployeeListItem, Department } from '../models/employee.model';

const mockPagination = { page: 1, pageSize: 10 };

const mockEmployeeListItem: EmployeeListItem = {
  id: 'e1',
  employeeId: 'EMP-001',
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@example.com',
  jobTitle: 'Engineer',
  department: 'Engineering',
  departmentId: 'd1',
  status: 'active',
  employmentType: 'full-time',
  hireDate: '2021-03-15',
};

const mockPaginatedResponse: PaginatedResponse<EmployeeListItem> = {
  data: [mockEmployeeListItem],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
  success: true,
  timestamp: new Date().toISOString(),
};

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiBaseUrl}/employees`;

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
    it('should call GET /employees with pagination params', () => {
      service.getEmployees(mockPagination).subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].employeeId).toBe('EMP-001');
        expect(res.pagination.total).toBe(1);
      });

      const req = httpMock.expectOne(
        (r) => r.url === baseUrl && r.params.get('page') === '1',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should append search filter to query params', () => {
      service.getEmployees(mockPagination, { search: 'Alice' }).subscribe();

      const req = httpMock.expectOne(
        (r) => r.url === baseUrl && r.params.get('search') === 'Alice',
      );
      req.flush(mockPaginatedResponse);
    });
  });

  describe('deleteEmployee()', () => {
    it('should call DELETE /employees/:id', () => {
      const mockResponse: ApiResponse<void> = {
        data: undefined as unknown as void,
        success: true,
        timestamp: new Date().toISOString(),
      };

      service.deleteEmployee('e1').subscribe((res) => {
        expect(res.success).toBeTrue();
      });

      const req = httpMock.expectOne(`${baseUrl}/e1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getDepartments()', () => {
    it('should call GET /departments', () => {
      const depts: Department[] = [
        { id: 'd1', name: 'Engineering', code: 'ENG', createdAt: '', updatedAt: '' },
      ];
      const mockResponse: ApiResponse<Department[]> = {
        data: depts,
        success: true,
        timestamp: new Date().toISOString(),
      };

      service.getDepartments().subscribe((res) => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].name).toBe('Engineering');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/departments`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
