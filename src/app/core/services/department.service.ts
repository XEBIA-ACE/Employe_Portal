import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Department,
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
} from '../models/department.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly apiUrl = `${environment.apiBaseUrl}/departments`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<PaginatedResponse<Department>> {
    return this.http.get<PaginatedResponse<Department>>(this.apiUrl);
  }

  getDepartment(id: string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.apiUrl}/${id}`);
  }

  createDepartment(
    payload: DepartmentCreateRequest,
  ): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(this.apiUrl, payload);
  }

  updateDepartment(
    id: string,
    payload: DepartmentUpdateRequest,
  ): Observable<ApiResponse<Department>> {
    return this.http.patch<ApiResponse<Department>>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

  deleteDepartment(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
