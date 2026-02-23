import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '@core/services/employee.service';
import { AttendanceService } from '@core/services/attendance.service';
import { LeaveService } from '@core/services/leave.service';
import { AuthService } from '@core/services/auth.service';
import { Employee } from '@core/models/employee.model';
import { Attendance } from '@core/models/attendance.model';
import { LeaveBalance } from '@core/models/leave.model';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { InitialsPipe } from '@shared/pipes/initials.pipe';
import { EmploymentStatusPipe } from '@shared/pipes/employment-status.pipe';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
    InitialsPipe,
    EmploymentStatusPipe
  ],
  template: `
    <div *ngIf="loading()">
      <div class="loading-center"><mat-spinner></mat-spinner></div>
    </div>

    <ng-container *ngIf="!loading() && employee()">
      <app-page-header
        [title]="employee()!.firstName + ' ' + employee()!.lastName"
        [subtitle]="(employee()!.positionTitle ?? 'Employee') + ' — ' + employee()!.departmentName"
        icon="person"
        [breadcrumbs]="[
          { label: 'Home', route: '/dashboard' },
          { label: 'Employees', route: '/employees' },
          { label: employee()!.firstName + ' ' + employee()!.lastName }
        ]">
        <button mat-stroked-button [routerLink]="['/employees', employee()!.id, 'edit']" *ngIf="isHrManager()">
          <mat-icon>edit</mat-icon> Edit
        </button>
      </app-page-header>

      <div class="detail-layout">
        <!-- Profile Card -->
        <mat-card class="profile-card">
          <mat-card-content>
            <div class="avatar-section">
              <div class="avatar" *ngIf="!employee()!.avatarUrl">
                {{ (employee()!.firstName + ' ' + employee()!.lastName) | initials }}
              </div>
              <img *ngIf="employee()!.avatarUrl" [src]="employee()!.avatarUrl" class="avatar-img" alt="Avatar">
            </div>
            <h2>{{ employee()!.firstName }} {{ employee()!.lastName }}</h2>
            <p class="position">{{ employee()!.positionTitle }}</p>
            <span class="status-badge"
              [class.active]="employee()!.employmentStatus === 'active'"
              [class.inactive]="employee()!.employmentStatus !== 'active'">
              {{ employee()!.employmentStatus | employmentStatus }}
            </span>

            <mat-divider class="divider"></mat-divider>

            <div class="info-list">
              <div class="info-item">
                <mat-icon>badge</mat-icon>
                <span>{{ employee()!.employeeId }}</span>
              </div>
              <div class="info-item">
                <mat-icon>email</mat-icon>
                <span>{{ employee()!.email }}</span>
              </div>
              <div class="info-item" *ngIf="employee()!.phone">
                <mat-icon>phone</mat-icon>
                <span>{{ employee()!.phone }}</span>
              </div>
              <div class="info-item">
                <mat-icon>business</mat-icon>
                <span>{{ employee()!.departmentName }}</span>
              </div>
              <div class="info-item">
                <mat-icon>calendar_today</mat-icon>
                <span>Since {{ employee()!.startDate | date:'mediumDate' }}</span>
              </div>
              <div class="info-item">
                <mat-icon>work</mat-icon>
                <span>{{ employee()!.employmentType | titlecase }}</span>
              </div>
            </div>

            <div class="skills" *ngIf="employee()!.skills?.length">
              <p class="skills-label">Skills</p>
              <mat-chip-set>
                <mat-chip *ngFor="let skill of employee()!.skills">{{ skill }}</mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tabs: Attendance & Leave -->
        <div class="tabs-section">
          <mat-tab-group>
            <mat-tab label="Leave Balances">
              <div class="tab-content">
                <div class="leave-grid" *ngIf="leaveBalances().length">
                  <mat-card *ngFor="let balance of leaveBalances()" class="leave-card">
                    <mat-card-content>
                      <p class="leave-type">{{ balance.leaveType | titlecase }}</p>
                      <div class="leave-stats">
                        <div>
                          <span class="stat-num">{{ balance.remaining }}</span>
                          <span class="stat-lbl">Remaining</span>
                        </div>
                        <div>
                          <span class="stat-num">{{ balance.taken }}</span>
                          <span class="stat-lbl">Taken</span>
                        </div>
                        <div>
                          <span class="stat-num">{{ balance.entitled }}</span>
                          <span class="stat-lbl">Entitled</span>
                        </div>
                      </div>
                    </mat-card-content>
                  </mat-card>
                </div>
                <p *ngIf="!leaveBalances().length" class="empty-msg">No leave balance data available.</p>
              </div>
            </mat-tab>

            <mat-tab label="Emergency Contact">
              <div class="tab-content">
                <ng-container *ngIf="employee()!.emergencyContact as ec; else noContact">
                  <div class="info-list">
                    <div class="info-item"><mat-icon>person</mat-icon><span>{{ ec.name }}</span></div>
                    <div class="info-item"><mat-icon>people</mat-icon><span>{{ ec.relationship }}</span></div>
                    <div class="info-item"><mat-icon>phone</mat-icon><span>{{ ec.phone }}</span></div>
                    <div class="info-item" *ngIf="ec.email"><mat-icon>email</mat-icon><span>{{ ec.email }}</span></div>
                  </div>
                </ng-container>
                <ng-template #noContact>
                  <p class="empty-msg">No emergency contact on file.</p>
                </ng-template>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    .loading-center { display: flex; justify-content: center; padding: 64px; }
    .detail-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start; }
    @media (max-width: 900px) { .detail-layout { grid-template-columns: 1fr; } }
    .profile-card { border-radius: 12px; text-align: center; }
    .avatar-section { display: flex; justify-content: center; margin-bottom: 16px; }
    .avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: #3f51b5; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; font-weight: 700;
    }
    .avatar-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
    h2 { margin: 0 0 4px; font-size: 1.2rem; }
    .position { margin: 0 0 8px; color: rgba(0,0,0,.5); font-size: 0.875rem; }
    .status-badge {
      display: inline-block; padding: 4px 12px; border-radius: 12px;
      font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    }
    .status-badge.active { background: #e8f5e9; color: #2e7d32; }
    .status-badge.inactive { background: #fafafa; color: #757575; }
    .divider { margin: 16px 0; }
    .info-list { display: flex; flex-direction: column; gap: 12px; text-align: left; }
    .info-item { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; }
    .info-item mat-icon { font-size: 18px; width: 18px; height: 18px; color: rgba(0,0,0,.4); }
    .skills-label { margin: 16px 0 8px; font-size: 0.75rem; text-transform: uppercase; color: rgba(0,0,0,.4); text-align: left; }
    .tab-content { padding: 16px; }
    .leave-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
    .leave-card { border-radius: 8px; }
    .leave-type { margin: 0 0 12px; font-size: 0.875rem; font-weight: 600; text-transform: capitalize; }
    .leave-stats { display: flex; gap: 16px; }
    .leave-stats > div { display: flex; flex-direction: column; align-items: center; }
    .stat-num { font-size: 1.5rem; font-weight: 700; color: #3f51b5; }
    .stat-lbl { font-size: 0.7rem; color: rgba(0,0,0,.5); }
    .empty-msg { color: rgba(0,0,0,.4); text-align: center; padding: 24px; }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  readonly employee = signal<Employee | null>(null);
  readonly leaveBalances = signal<LeaveBalance[]>([]);
  readonly loading = signal(true);
  readonly isHrManager = this.authService.isHrManager;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        this.employee.set(res.data);
        this.loading.set(false);
        this.loadLeaveBalances(id);
      },
      error: () => this.loading.set(false)
    });
  }

  private loadLeaveBalances(employeeId: string): void {
    this.leaveService.getLeaveBalance(employeeId).subscribe({
      next: (res) => this.leaveBalances.set(res.data),
      error: () => {} // Non-critical
    });
  }
}
