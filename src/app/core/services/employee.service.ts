import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Employee,
  EmployeeListItem,
  EmployeeFormData,
  EmployeeFilter,
  EmployeeStats,
  Department,
} from '../models/employee.model';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '../models/api-response.model';

/**
 * Employee CRUD service.
 * All methods return typed Observables; components subscribe
 * and handle loading/error state via the UI.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly baseUrl = `${environment.apiBaseUrl}/employees`;
  private readonly deptUrl = `${environment.apiBaseUrl}/departments`;

  constructor(private http: HttpClient) {}

  // ─── Employee endpoints ───────────────────────────────────────────────

  getEmployees(
    pagination: PaginationParams,
    filters?: EmployeeFilter,
  ): Observable<PaginatedResponse<EmployeeListItem>> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

    if (pagination.sortBy) params = params.set('sortBy', pagination.sortBy);
    if (pagination.sortOrder) params = params.set('sortOrder', pagination.sortOrder);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.departmentId) params = params.set('departmentId', filters.departmentId);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.employmentType) params = params.set('employmentType', filters.employmentType);
    if (filters?.managerId) params = params.set('managerId', filters.managerId);

    return this.http.get<PaginatedResponse<EmployeeListItem>>(this.baseUrl, { params });
  }

  getEmployeeById(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.baseUrl}/${id}`);
  }

  createEmployee(data: EmployeeFormData): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.baseUrl, data);
  }

  updateEmployee(id: string, data: Partial<EmployeeFormData>): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.baseUrl}/${id}`, data);
  }

  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  getEmployeeStats(): Observable<ApiResponse<EmployeeStats>> {
    return this.http.get<ApiResponse<EmployeeStats>>(`${this.baseUrl}/stats`);
  }

  /** Upload employee profile photo; returns the avatar URL */
  uploadAvatar(id: string, file: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ApiResponse<{ avatarUrl: string }>>(
      `${this.baseUrl}/${id}/avatar`,
      form,
    );
  }

  exportEmployees(format: 'csv' | 'xlsx', filters?: EmployeeFilter): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    if (filters?.departmentId) params = params.set('departmentId', filters.departmentId);
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }

  // ─── Department endpoints ─────────────────────────────────────────────

  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(this.deptUrl);
  }

  getDepartmentById(id: string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.deptUrl}/${id}`);
  }

  createDepartment(data: Partial<Department>): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.deptUrl, data);
  }

  updateDepartment(id: string, data: Partial<Department>): Observable<ApiResponse<Department>> {
    return this.http.put<ApiResponse<Department>>(`${this.deptUrl}/${id}`, data);
  }

  deleteDepartment(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.deptUrl}/${id}`);
  }
}
