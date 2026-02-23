import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeStats } from '../../core/models/employee.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  change?: number; // % change vs last period
  route?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly employeeService = inject(EmployeeService);

  stats: EmployeeStats | null = null;
  isLoading = true;
  statCards: StatCard[] = [];

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.employeeService.getEmployeeStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.buildStatCards();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Use mock data for demonstration if API is unavailable
        this.stats = this.getMockStats();
        this.buildStatCards();
      },
    });
  }

  private buildStatCards(): void {
    if (!this.stats) return;
    this.statCards = [
      {
        title: 'Total Employees',
        value: this.stats.total,
        icon: 'people',
        color: '#3f51b5',
        change: 5,
        route: '/employees',
      },
      {
        title: 'Active',
        value: this.stats.active,
        icon: 'check_circle',
        color: '#4caf50',
        route: '/employees',
      },
      {
        title: 'On Leave',
        value: this.stats.onLeave,
        icon: 'beach_access',
        color: '#2196f3',
      },
      {
        title: 'New This Month',
        value: this.stats.newThisMonth,
        icon: 'person_add',
        color: '#ff9800',
        change: 12,
      },
    ];
  }

  private getMockStats(): EmployeeStats {
    return {
      total: 248,
      active: 231,
      inactive: 8,
      onLeave: 9,
      newThisMonth: 14,
      byDepartment: [
        { department: 'Engineering', count: 72 },
        { department: 'Sales', count: 45 },
        { department: 'Marketing', count: 31 },
        { department: 'HR', count: 18 },
        { department: 'Finance', count: 24 },
        { department: 'Operations', count: 58 },
      ],
      byEmploymentType: [
        { type: 'full-time', count: 190 },
        { type: 'part-time', count: 32 },
        { type: 'contract', count: 20 },
        { type: 'intern', count: 6 },
      ],
    };
  }
}
