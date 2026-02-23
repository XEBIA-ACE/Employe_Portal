import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeSummary } from '../../core/models/employee.model';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  summary: EmployeeSummary | null = null;
  isLoading = true;
  error: string | null = null;

  readonly statCards = [
    {
      key: 'totalEmployees' as keyof EmployeeSummary,
      label: 'Total Employees',
      icon: '👥',
      color: '#e3f2fd',
      iconColor: '#1976d2',
    },
    {
      key: 'activeEmployees' as keyof EmployeeSummary,
      label: 'Active',
      icon: '✅',
      color: '#e8f5e9',
      iconColor: '#388e3c',
    },
    {
      key: 'onLeaveEmployees' as keyof EmployeeSummary,
      label: 'On Leave',
      icon: '🏖️',
      color: '#fff3e0',
      iconColor: '#f57c00',
    },
    {
      key: 'newHiresThisMonth' as keyof EmployeeSummary,
      label: 'New Hires This Month',
      icon: '🆕',
      color: '#fce4ec',
      iconColor: '#c2185b',
    },
  ];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.error = null;

    this.employeeService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard data. Please try refreshing.';
        this.isLoading = false;
      },
    });
  }

  getSummaryValue(key: keyof EmployeeSummary): number {
    if (!this.summary) return 0;
    const val = this.summary[key];
    return typeof val === 'number' ? val : 0;
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}
