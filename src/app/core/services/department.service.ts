import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../models/department.model';
import { ApiResponse } from '../models/api-response.model';

/**
 * Department resource service.
 */
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch all departments.
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  /**
   * Fetch a single department by ID.
   */
  getDepartment(id: string): Observable<Department> {
    return this.http
      .get<ApiResponse<Department>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  /**
   * Create a new department.
   */
  createDepartment(dept: CreateDepartmentDto): Observable<Department> {
    return this.http
      .post<ApiResponse<Department>>(this.apiUrl, dept)
      .pipe(map(res => res.data));
  }

  /**
   * Update a department.
   */
  updateDepartment(id: string, updates: UpdateDepartmentDto): Observable<Department> {
    return this.http
      .put<ApiResponse<Department>>(`${this.apiUrl}/${id}`, updates)
      .pipe(map(res => res.data));
  }

  /**
   * Delete a department.
   */
  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
