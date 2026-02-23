import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilter
} from '@core/models/employee.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@core/models/api.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(
    filter?: EmployeeFilter,
    pagination?: PaginationParams
  ): Observable<PaginatedResponse<Employee>> {
    let params = new HttpParams();

    // Pagination
    if (pagination?.page) params = params.set('page', pagination.page);
    if (pagination?.pageSize) params = params.set('pageSize', pagination.pageSize);
    if (pagination?.sortBy) params = params.set('sortBy', pagination.sortBy);
    if (pagination?.sortOrder) params = params.set('sortOrder', pagination.sortOrder);

    // Filters
    if (filter?.search) params = params.set('search', filter.search);
    if (filter?.departmentId) params = params.set('departmentId', filter.departmentId);
    if (filter?.employmentStatus) params = params.set('employmentStatus', filter.employmentStatus);
    if (filter?.employmentType) params = params.set('employmentType', filter.employmentType);
    if (filter?.managerId) params = params.set('managerId', filter.managerId);

    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params });
  }

  getEmployee(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  createEmployee(payload: CreateEmployeeRequest): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, payload);
  }

  updateEmployee(id: string, payload: UpdateEmployeeRequest): Observable<ApiResponse<Employee>> {
    return this.http.patch<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  uploadAvatar(employeeId: string, file: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<ApiResponse<{ avatarUrl: string }>>(
      `${this.apiUrl}/${employeeId}/avatar`,
      formData
    );
  }

  getDirectReports(managerId: string): Observable<PaginatedResponse<Employee>> {
    return this.http.get<PaginatedResponse<Employee>>(`${this.apiUrl}/${managerId}/reports`);
  }
}
