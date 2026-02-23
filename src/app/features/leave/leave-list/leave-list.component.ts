import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { LeaveService } from '@core/services/leave.service';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { LeaveRequest, LeaveFilter, LeaveStatus, LeaveType } from '@core/models/leave.model';
import { PaginationMeta } from '@core/models/api.model';
import { environment } from '@environments/environment';
import {
  DataTableComponent,
  TableColumn,
  TableAction
} from '@shared/components/data-table/data-table.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData
} from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LeaveRequestDialogComponent } from '../leave-request-dialog/leave-request-dialog.component';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    DataTableComponent,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="Leave Management"
      subtitle="Track and manage employee leave requests"
      icon="event_busy"
      [breadcrumbs]="[{ label: 'Home', route: '/dashboard' }, { label: 'Leave' }]">
      <button mat-flat-button color="primary" (click)="openLeaveDialog()">
        <mat-icon>add</mat-icon> New Request
      </button>
    </app-page-header>

    <!-- Filters -->
    <div class="filters-row">
      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select [formControl]="statusCtrl">
          <mat-option value="">All</mat-option>
          <mat-option value="pending">Pending</mat-option>
          <mat-option value="approved">Approved</mat-option>
          <mat-option value="rejected">Rejected</mat-option>
          <mat-option value="cancelled">Cancelled</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Leave Type</mat-label>
        <mat-select [formControl]="typeCtrl">
          <mat-option value="">All</mat-option>
          <mat-option value="annual">Annual</mat-option>
          <mat-option value="sick">Sick</mat-option>
          <mat-option value="maternity">Maternity</mat-option>
          <mat-option value="paternity">Paternity</mat-option>
          <mat-option value="unpaid">Unpaid</mat-option>
          <mat-option value="emergency">Emergency</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <app-data-table
      [columns]="columns"
      [dataSource]="leaves()"
      [actions]="getTableActions()"
      [loading]="loading()"
      [pagination]="pagination()"
      (pageChange)="onPage($event)"
      (sortChange)="onSort($event)"
      (actionClick)="onAction($event)">
    </app-data-table>
  `,
  styles: [`
    .filters-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
  `]
})
export class LeaveListComponent implements OnInit {
  readonly leaves = signal<LeaveRequest[]>([]);
  readonly loading = signal(false);
  readonly pagination = signal<PaginationMeta | undefined>(undefined);

  statusCtrl = new FormControl('');
  typeCtrl = new FormControl('');
  private currentPage = 1;

  readonly columns: TableColumn[] = [
    { key: 'employeeName',  label: 'Employee',   sortable: true },
    {
      key: 'leaveType', label: 'Type', type: 'badge',
      badgeConfig: {
        annual:    { color: '#1976d2', label: 'Annual' },
        sick:      { color: '#d32f2f', label: 'Sick' },
        maternity: { color: '#c2185b', label: 'Maternity' },
        paternity: { color: '#7b1fa2', label: 'Paternity' },
        unpaid:    { color: '#616161', label: 'Unpaid' },
        emergency: { color: '#e64a19', label: 'Emergency' },
        study:     { color: '#0097a7', label: 'Study' }
      }
    },
    { key: 'startDate',   label: 'Start Date', type: 'date', sortable: true },
    { key: 'endDate',     label: 'End Date',   type: 'date', sortable: true },
    { key: 'totalDays',   label: 'Days' },
    {
      key: 'status', label: 'Status', type: 'badge',
      badgeConfig: {
        pending:   { color: '#ff9800', label: 'Pending' },
        approved:  { color: '#4caf50', label: 'Approved' },
        rejected:  { color: '#f44336', label: 'Rejected' },
        cancelled: { color: '#9e9e9e', label: 'Cancelled' }
      }
    },
    { key: 'createdAt', label: 'Submitted', type: 'date' }
  ];

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
    this.statusCtrl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadLeaves(); });
    this.typeCtrl.valueChanges.subscribe(() => { this.currentPage = 1; this.loadLeaves(); });
  }

  getTableActions(): TableAction[] {
    const actions: TableAction[] = [
      { icon: 'visibility', label: 'View', action: 'view', color: 'primary' }
    ];

    if (this.authService.isManager()) {
      actions.push(
        { icon: 'check_circle', label: 'Approve', action: 'approve', color: 'accent',
          visibleWhen: (row) => (row as LeaveRequest).status === 'pending' },
        { icon: 'cancel', label: 'Reject', action: 'reject', color: 'warn',
          visibleWhen: (row) => (row as LeaveRequest).status === 'pending' }
      );
    }

    return actions;
  }

  loadLeaves(): void {
    this.loading.set(true);
    const filter: LeaveFilter = {
      status: (this.statusCtrl.value as LeaveStatus) || undefined,
      leaveType: (this.typeCtrl.value as LeaveType) || undefined
    };

    this.leaveService.getLeaveRequests(filter, {
      page: this.currentPage,
      pageSize: environment.pagination.defaultPageSize
    }).subscribe({
      next: (res) => {
        this.leaves.set(res.data);
        this.pagination.set(res.meta);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadLeaves();
  }

  onSort(_sort: Sort): void {
    this.loadLeaves();
  }

  onAction(event: { action: string; row: unknown }): void {
    const leave = event.row as LeaveRequest;
    switch (event.action) {
      case 'approve': this.updateStatus(leave, 'approved'); break;
      case 'reject':  this.confirmReject(leave); break;
    }
  }

  openLeaveDialog(): void {
    this.dialog.open(LeaveRequestDialogComponent, { width: '520px' })
      .afterClosed()
      .subscribe((submitted) => { if (submitted) this.loadLeaves(); });
  }

  private updateStatus(leave: LeaveRequest, status: 'approved' | 'rejected', reason?: string): void {
    this.leaveService.updateLeaveStatus({
      leaveRequestId: leave.id, status, rejectionReason: reason
    }).subscribe({
      next: () => {
        this.notificationService.success(`Leave request ${status}.`);
        this.loadLeaves();
      }
    });
  }

  private confirmReject(leave: LeaveRequest): void {
    const data: ConfirmDialogData = {
      title: 'Reject Leave Request',
      message: `Reject the leave request from ${leave.employeeName}?`,
      confirmLabel: 'Reject',
      icon: 'cancel',
      confirmColor: 'warn'
    };
    this.dialog.open(ConfirmDialogComponent, { data, width: '400px' })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.updateStatus(leave, 'rejected');
      });
  }
}
