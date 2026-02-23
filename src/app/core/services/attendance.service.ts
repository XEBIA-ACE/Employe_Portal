import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Attendance,
  AttendanceSummary,
  CheckInRequest,
  CheckOutRequest,
  AttendanceFilter
} from '@core/models/attendance.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@core/models/api.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  getAttendance(
    filter?: AttendanceFilter,
    pagination?: PaginationParams
  ): Observable<PaginatedResponse<Attendance>> {
    let params = new HttpParams();
    if (pagination?.page) params = params.set('page', pagination.page);
    if (pagination?.pageSize) params = params.set('pageSize', pagination.pageSize);
    if (filter?.employeeId) params = params.set('employeeId', filter.employeeId);
    if (filter?.departmentId) params = params.set('departmentId', filter.departmentId);
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.dateFrom) params = params.set('dateFrom', filter.dateFrom.toISOString());
    if (filter?.dateTo) params = params.set('dateTo', filter.dateTo.toISOString());

    return this.http.get<PaginatedResponse<Attendance>>(this.apiUrl, { params });
  }

  getTodayAttendance(employeeId: string): Observable<ApiResponse<Attendance>> {
    return this.http.get<ApiResponse<Attendance>>(`${this.apiUrl}/today/${employeeId}`);
  }

  checkIn(payload: CheckInRequest): Observable<ApiResponse<Attendance>> {
    return this.http.post<ApiResponse<Attendance>>(`${this.apiUrl}/check-in`, payload);
  }

  checkOut(payload: CheckOutRequest): Observable<ApiResponse<Attendance>> {
    return this.http.patch<ApiResponse<Attendance>>(`${this.apiUrl}/check-out`, payload);
  }

  getSummary(employeeId: string, month: number, year: number): Observable<ApiResponse<AttendanceSummary>> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<ApiResponse<AttendanceSummary>>(
      `${this.apiUrl}/summary/${employeeId}`,
      { params }
    );
  }
}
