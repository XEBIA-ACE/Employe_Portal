import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { AttendanceService } from '@core/services/attendance.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { Attendance, AttendanceSummary, AttendanceFilter } from '@core/models/attendance.model';
import { PaginationMeta } from '@core/models/api.model';
import { environment } from '@environments/environment';
import {
  DataTableComponent,
  TableColumn
} from '@shared/components/data-table/data-table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DataTableComponent,
    PageHeaderComponent,
    StatCardComponent
  ],
  template: `
    <app-page-header
      title="Attendance"
      subtitle="Track employee attendance records"
      icon="schedule"
      [breadcrumbs]="[{ label: 'Home', route: '/dashboard' }, { label: 'Attendance' }]">

      <!-- Check-in/out for own account -->
      <ng-container *ngIf="!isManager()">
        <button mat-stroked-button color="accent" (click)="checkIn()" [disabled]="todayAttendance()?.checkIn">
          <mat-icon>login</mat-icon> Check In
        </button>
        <button mat-flat-button color="primary" (click)="checkOut()"
          [disabled]="!todayAttendance()?.checkIn || !!todayAttendance()?.checkOut">
          <mat-icon>logout</mat-icon> Check Out
        </button>
      </ng-container>
    </app-page-header>

    <!-- Today's summary for own account -->
    <mat-card class="today-card" *ngIf="!isManager() && todayAttendance()">
      <mat-card-content>
        <div class="today-info">
          <div class="today-item">
            <mat-icon>login</mat-icon>
            <div>
              <small>Check In</small>
              <span>{{ todayAttendance()?.checkIn | date:'shortTime' }}</span>
            </div>
          </div>
          <div class="today-item">
            <mat-icon>logout</mat-icon>
            <div>
              <small>Check Out</small>
              <span>{{ todayAttendance()?.checkOut ? (todayAttendance()?.checkOut | date:'shortTime') : '—' }}</span>
            </div>
          </div>
          <div class="today-item">
            <mat-icon>schedule</mat-icon>
            <div>
              <small>Hours Worked</small>
              <span>{{ todayAttendance()?.workHours?.toFixed(1) ?? '—' }}h</span>
            </div>
          </div>
          <div class="today-item">
            <mat-icon>info</mat-icon>
            <div>
              <small>Status</small>
              <span class="status-chip">{{ todayAttendance()?.status | titlecase }}</span>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- Filters -->
    <div class="filters-row">
      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select [formControl]="statusCtrl">
          <mat-option value="">All</mat-option>
          <mat-option value="present">Present</mat-option>
          <mat-option value="absent">Absent</mat-option>
          <mat-option value="late">Late</mat-option>
          <mat-option value="half_day">Half Day</mat-option>
          <mat-option value="on_leave">On Leave</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>From Date</mat-label>
        <input matInput [matDatepicker]="fromPicker" [formControl]="fromDateCtrl">
        <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
        <mat-datepicker #fromPicker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>To Date</mat-label>
        <input matInput [matDatepicker]="toPicker" [formControl]="toDateCtrl">
        <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
        <mat-datepicker #toPicker></mat-datepicker>
      </mat-form-field>
    </div>

    <app-data-table
      [columns]="columns"
      [dataSource]="attendanceRecords()"
      [loading]="loading()"
      [pagination]="pagination()"
      (pageChange)="onPage($event)">
    </app-data-table>
  `,
  styles: [`
    .today-card { margin-bottom: 24px; border-radius: 12px; border-left: 4px solid #4caf50; }
    .today-info { display: flex; gap: 32px; flex-wrap: wrap; }
    .today-item { display: flex; align-items: center; gap: 12px; }
    .today-item mat-icon { color: #4caf50; }
    .today-item small { display: block; font-size: 0.7rem; color: rgba(0,0,0,.5); }
    .today-item span { font-size: 1rem; font-weight: 600; }
    .status-chip { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; }
    .filters-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
  `]
})
export class AttendanceComponent implements OnInit {
  readonly attendanceRecords = signal<Attendance[]>([]);
  readonly todayAttendance = signal<Attendance | null>(null);
  readonly loading = signal(false);
  readonly pagination = signal<PaginationMeta | undefined>(undefined);

  readonly isManager = this.authService.isManager;

  statusCtrl = new FormControl('');
  fromDateCtrl = new FormControl<Date | null>(null);
  toDateCtrl = new FormControl<Date | null>(null);

  private currentPage = 1;

  readonly columns: TableColumn[] = [
    { key: 'employeeName', label: 'Employee',  sortable: true },
    { key: 'date',         label: 'Date',      type: 'date', sortable: true },
    { key: 'checkIn',     label: 'Check In',  type: 'date' },
    { key: 'checkOut',    label: 'Check Out', type: 'date' },
    { key: 'workHours',   label: 'Hours' },
    {
      key: 'status', label: 'Status', type: 'badge',
      badgeConfig: {
        present:  { color: '#4caf50', label: 'Present' },
        absent:   { color: '#f44336', label: 'Absent' },
        late:     { color: '#ff9800', label: 'Late' },
        half_day: { color: '#03a9f4', label: 'Half Day' },
        on_leave: { color: '#9c27b0', label: 'On Leave' },
        holiday:  { color: '#607d8b', label: 'Holiday' }
      }
    }
  ];

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAttendance();

    if (!this.isManager()) {
      this.loadTodayAttendance();
    }

    this.statusCtrl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadAttendance(); });
    this.fromDateCtrl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadAttendance(); });
    this.toDateCtrl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadAttendance(); });
  }

  checkIn(): void {
    const employeeId = this.authService.currentUser()?.employeeId ?? '';
    this.attendanceService.checkIn({ employeeId, checkIn: new Date() }).subscribe({
      next: (res) => {
        this.todayAttendance.set(res.data);
        this.notificationService.success('Checked in successfully.');
      }
    });
  }

  checkOut(): void {
    const attendance = this.todayAttendance();
    if (!attendance) return;

    this.attendanceService.checkOut({ attendanceId: attendance.id, checkOut: new Date() }).subscribe({
      next: (res) => {
        this.todayAttendance.set(res.data);
        this.notificationService.success('Checked out successfully.');
      }
    });
  }

  loadAttendance(): void {
    this.loading.set(true);
    const filter: AttendanceFilter = {
      status: (this.statusCtrl.value as never) || undefined,
      dateFrom: this.fromDateCtrl.value ?? undefined,
      dateTo: this.toDateCtrl.value ?? undefined
    };

    this.attendanceService.getAttendance(filter, {
      page: this.currentPage,
      pageSize: environment.pagination.defaultPageSize
    }).subscribe({
      next: (res) => {
        this.attendanceRecords.set(res.data);
        this.pagination.set(res.meta);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadAttendance();
  }

  private loadTodayAttendance(): void {
    const employeeId = this.authService.currentUser()?.employeeId ?? '';
    if (!employeeId) return;

    this.attendanceService.getTodayAttendance(employeeId).subscribe({
      next: (res) => this.todayAttendance.set(res.data),
      error: () => {} // Not found = no record yet today
    });
  }
}
