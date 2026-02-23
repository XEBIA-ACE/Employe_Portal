import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Department,
  Position,
  CreateDepartmentRequest,
  UpdateDepartmentRequest
} from '@core/models/department.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@core/models/api.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly apiUrl = `${environment.apiUrl}/departments`;
  private readonly positionsUrl = `${environment.apiUrl}/positions`;

  constructor(private http: HttpClient) {}

  getDepartments(
    pagination?: PaginationParams,
    includeInactive = false
  ): Observable<PaginatedResponse<Department>> {
    let params = new HttpParams();
    if (pagination?.page) params = params.set('page', pagination.page);
    if (pagination?.pageSize) params = params.set('pageSize', pagination.pageSize);
    if (pagination?.sortBy) params = params.set('sortBy', pagination.sortBy);
    if (includeInactive) params = params.set('includeInactive', 'true');

    return this.http.get<PaginatedResponse<Department>>(this.apiUrl, { params });
  }

  getDepartment(id: string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.apiUrl}/${id}`);
  }

  createDepartment(payload: CreateDepartmentRequest): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.apiUrl, payload);
  }

  updateDepartment(
    id: string,
    payload: UpdateDepartmentRequest
  ): Observable<ApiResponse<Department>> {
    return this.http.patch<ApiResponse<Department>>(`${this.apiUrl}/${id}`, payload);
  }

  deleteDepartment(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Positions
  getPositions(departmentId?: string): Observable<PaginatedResponse<Position>> {
    let params = new HttpParams();
    if (departmentId) params = params.set('departmentId', departmentId);
    return this.http.get<PaginatedResponse<Position>>(this.positionsUrl, { params });
  }

  getPosition(id: string): Observable<ApiResponse<Position>> {
    return this.http.get<ApiResponse<Position>>(`${this.positionsUrl}/${id}`);
  }
}
