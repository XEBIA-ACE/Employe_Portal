import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  LeaveRequest,
  LeaveBalance,
  CreateLeaveRequest,
  UpdateLeaveStatusRequest,
  LeaveFilter
} from '@core/models/leave.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@core/models/api.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  getLeaveRequests(
    filter?: LeaveFilter,
    pagination?: PaginationParams
  ): Observable<PaginatedResponse<LeaveRequest>> {
    let params = new HttpParams();
    if (pagination?.page) params = params.set('page', pagination.page);
    if (pagination?.pageSize) params = params.set('pageSize', pagination.pageSize);
    if (filter?.employeeId) params = params.set('employeeId', filter.employeeId);
    if (filter?.departmentId) params = params.set('departmentId', filter.departmentId);
    if (filter?.leaveType) params = params.set('leaveType', filter.leaveType);
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.dateFrom) params = params.set('dateFrom', filter.dateFrom.toISOString());
    if (filter?.dateTo) params = params.set('dateTo', filter.dateTo.toISOString());

    return this.http.get<PaginatedResponse<LeaveRequest>>(this.apiUrl, { params });
  }

  getLeaveRequest(id: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.get<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}`);
  }

  createLeaveRequest(payload: CreateLeaveRequest): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(this.apiUrl, payload);
  }

  updateLeaveStatus(payload: UpdateLeaveStatusRequest): Observable<ApiResponse<LeaveRequest>> {
    return this.http.patch<ApiResponse<LeaveRequest>>(
      `${this.apiUrl}/${payload.leaveRequestId}/status`,
      { status: payload.status, rejectionReason: payload.rejectionReason }
    );
  }

  cancelLeaveRequest(id: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.patch<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getLeaveBalance(employeeId: string, year?: number): Observable<ApiResponse<LeaveBalance[]>> {
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    return this.http.get<ApiResponse<LeaveBalance[]>>(
      `${this.apiUrl}/balance/${employeeId}`,
      { params }
    );
  }
}
