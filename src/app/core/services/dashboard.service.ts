import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { DashboardStats, ApiResponse } from '@core/models/api.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`);
  }

  getHeadcountTrend(months = 12): Observable<ApiResponse<{ month: string; count: number }[]>> {
    return this.http.get<ApiResponse<{ month: string; count: number }[]>>(
      `${this.apiUrl}/headcount-trend`,
      { params: { months } }
    );
  }

  getDepartmentDistribution(): Observable<ApiResponse<{ department: string; count: number }[]>> {
    return this.http.get<ApiResponse<{ department: string; count: number }[]>>(
      `${this.apiUrl}/department-distribution`
    );
  }
}
