import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Employee,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  EmployeeFilters,
  EmployeeSummary,
} from '../models/employee.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apiUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private http: HttpClient) {}

  // ─── CRUD Operations ──────────────────────────────────────────────────────

  /**
   * Retrieve a paginated, filtered list of employees.
   * Supports search, department filter, status filter, sorting, and pagination.
   */
  getEmployees(
    filters: EmployeeFilters = {},
  ): Observable<PaginatedResponse<Employee>> {
    const params = this.buildParams(filters);
    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params });
  }

  getEmployee(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  createEmployee(
    payload: EmployeeCreateRequest,
  ): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, payload);
  }

  updateEmployee(
    id: string,
    payload: EmployeeUpdateRequest,
  ): Observable<ApiResponse<Employee>> {
    return this.http.patch<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEmployee(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // ─── Additional Endpoints ─────────────────────────────────────────────────

  /**
   * Dashboard summary statistics.
   */
  getSummary(): Observable<ApiResponse<EmployeeSummary>> {
    return this.http.get<ApiResponse<EmployeeSummary>>(
      `${this.apiUrl}/summary`,
    );
  }

  /**
   * Upload an avatar photo for an employee.
   * Returns the new avatarUrl on success.
   */
  uploadAvatar(id: string, file: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<ApiResponse<{ avatarUrl: string }>>(
      `${this.apiUrl}/${id}/avatar`,
      formData,
    );
  }

  /**
   * Export the employee list as CSV.
   * The blob can be downloaded by the browser using a temporary <a> element.
   */
  exportCsv(filters: EmployeeFilters = {}): Observable<Blob> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.apiUrl}/export/csv`, {
      params,
      responseType: 'blob',
    });
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private buildParams(filters: EmployeeFilters): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }
}
