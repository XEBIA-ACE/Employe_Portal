import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeQueryParams,
} from '../models/employee.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

/**
 * Employee resource service.
 * All HTTP calls go through this service; interceptors handle auth tokens and errors.
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch a paginated list of employees with optional filters.
   */
  getEmployees(params?: EmployeeQueryParams): Observable<PaginatedResponse<Employee>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Fetch a single employee by ID.
   */
  getEmployee(id: string): Observable<Employee> {
    return this.http
      .get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  /**
   * Create a new employee record.
   */
  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http
      .post<ApiResponse<Employee>>(this.apiUrl, employee)
      .pipe(map(res => res.data));
  }

  /**
   * Update an existing employee record.
   */
  updateEmployee(id: string, updates: UpdateEmployeeDto): Observable<Employee> {
    return this.http
      .put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, updates)
      .pipe(map(res => res.data));
  }

  /**
   * Delete an employee record.
   */
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all employees in a specific department.
   */
  getEmployeesByDepartment(departmentId: string): Observable<Employee[]> {
    return this.getEmployees({ departmentId }).pipe(map(res => res.data));
  }
}
