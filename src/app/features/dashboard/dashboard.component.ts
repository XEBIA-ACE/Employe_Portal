import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '@core/services/dashboard.service';
import { AuthService } from '@core/services/auth.service';
import { DashboardStats } from '@core/models/api.model';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';

interface StatItem {
  label: string;
  valueKey: keyof DashboardStats;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    StatCardComponent,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="Dashboard"
      subtitle="Welcome back, {{ currentUser()?.firstName }}! Here's what's happening."
      icon="dashboard">
    </app-page-header>

    <!-- Loading state -->
    <div class="loading-center" *ngIf="loading()">
      <mat-spinner></mat-spinner>
    </div>

    <!-- Stats grid -->
    <div class="stats-grid" *ngIf="!loading() && stats()">
      <app-stat-card
        *ngFor="let stat of statItems"
        [label]="stat.label"
        [value]="stats()![stat.valueKey] as number"
        [icon]="stat.icon"
        [color]="stat.color">
      </app-stat-card>
    </div>

    <!-- Attendance overview -->
    <div class="section-grid" *ngIf="!loading() && stats()">
      <mat-card class="overview-card">
        <mat-card-header>
          <mat-card-title>Today's Attendance</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="attendance-bars">
            <div class="bar-item">
              <span>Present</span>
              <div class="bar-track">
                <div class="bar-fill present"
                  [style.width.%]="getAttendancePercent('present')">
                </div>
              </div>
              <span class="bar-count">{{ stats()!.presentToday }}</span>
            </div>
            <div class="bar-item">
              <span>Absent</span>
              <div class="bar-track">
                <div class="bar-fill absent"
                  [style.width.%]="getAttendancePercent('absent')">
                </div>
              </div>
              <span class="bar-count">{{ stats()!.absentToday }}</span>
            </div>
            <div class="bar-item">
              <span>On Leave</span>
              <div class="bar-track">
                <div class="bar-fill on-leave"
                  [style.width.%]="getAttendancePercent('onLeave')">
                </div>
              </div>
              <span class="bar-count">{{ stats()!.onLeaveToday }}</span>
            </div>
          </div>
          <p class="attendance-rate">
            Overall Attendance Rate:
            <strong>{{ stats()!.attendanceRate | number:'1.1-1' }}%</strong>
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="overview-card">
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-actions">
            <a class="action-item" routerLink="/employees/new">
              <span class="action-icon" style="background:#e8f5e9">
                <mat-icon style="color:#388e3c">person_add</mat-icon>
              </span>
              <span>Add Employee</span>
            </a>
            <a class="action-item" routerLink="/leave">
              <span class="action-icon" style="background:#fff3e0">
                <mat-icon style="color:#f57c00">event</mat-icon>
              </span>
              <span>Leave Requests</span>
            </a>
            <a class="action-item" routerLink="/attendance">
              <span class="action-icon" style="background:#e3f2fd">
                <mat-icon style="color:#1976d2">schedule</mat-icon>
              </span>
              <span>Attendance</span>
            </a>
            <a class="action-item" routerLink="/departments">
              <span class="action-icon" style="background:#f3e5f5">
                <mat-icon style="color:#7b1fa2">business</mat-icon>
              </span>
              <span>Departments</span>
            </a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .loading-center { display: flex; justify-content: center; padding: 48px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .section-grid { grid-template-columns: 1fr; } }
    .overview-card { border-radius: 12px; }
    .attendance-bars { display: flex; flex-direction: column; gap: 16px; }
    .bar-item { display: grid; grid-template-columns: 80px 1fr 48px; align-items: center; gap: 12px; }
    .bar-item span { font-size: 0.875rem; color: rgba(0,0,0,.6); }
    .bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
    .bar-fill.present { background: #4caf50; }
    .bar-fill.absent { background: #f44336; }
    .bar-fill.on-leave { background: #ff9800; }
    .bar-count { font-weight: 600; text-align: right; }
    .attendance-rate { margin-top: 16px; color: rgba(0,0,0,.6); font-size: 0.875rem; }
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .action-item {
      display: flex; align-items: center; gap: 12px;
      padding: 12px; border-radius: 8px; border: 1px solid #eee;
      cursor: pointer; text-decoration: none; color: rgba(0,0,0,.87);
      transition: box-shadow 0.2s; font-size: 0.875rem;
    }
    .action-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,.12); }
    .action-icon {
      width: 40px; height: 40px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly loading = signal(true);
  readonly stats = signal<DashboardStats | null>(null);
  readonly currentUser = this.authService.currentUser;

  readonly statItems: StatItem[] = [
    { label: 'Total Employees',    valueKey: 'totalEmployees',       icon: 'people',      color: '#3f51b5' },
    { label: 'Active Employees',   valueKey: 'activeEmployees',      icon: 'how_to_reg',  color: '#4caf50' },
    { label: 'New Hires (Month)',  valueKey: 'newHiresThisMonth',    icon: 'person_add',  color: '#009688' },
    { label: 'Departments',        valueKey: 'totalDepartments',     icon: 'business',    color: '#9c27b0' },
    { label: 'Pending Leaves',     valueKey: 'pendingLeaveRequests', icon: 'pending',     color: '#ff9800' },
    { label: 'Present Today',      valueKey: 'presentToday',         icon: 'check_circle',color: '#00bcd4' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getAttendancePercent(type: 'present' | 'absent' | 'onLeave'): number {
    const s = this.stats();
    if (!s) return 0;
    const total = s.presentToday + s.absentToday + s.onLeaveToday;
    if (total === 0) return 0;
    const map = { present: s.presentToday, absent: s.absentToday, onLeave: s.onLeaveToday };
    return (map[type] / total) * 100;
  }
}
