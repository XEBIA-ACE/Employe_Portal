import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import { EmployeeStats } from '../../core/models/employee.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatTableModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly notification = inject(NotificationService);

  stats: EmployeeStats | null = null;
  isLoading = true;
  selectedFormat: 'csv' | 'xlsx' = 'csv';

  deptColumns = ['department', 'count', 'percentage'];
  typeColumns = ['type', 'count', 'percentage'];

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.employeeService.getEmployeeStats().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Fallback mock data
        this.stats = {
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
      },
    });
  }

  getPercentage(count: number): number {
    if (!this.stats || this.stats.total === 0) return 0;
    return Math.round((count / this.stats.total) * 100);
  }

  onExport(): void {
    this.notification.info(`Exporting report as ${this.selectedFormat.toUpperCase()}…`);
    this.employeeService.exportEmployees(this.selectedFormat).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `employee-report.${this.selectedFormat}`;
        link.click();
        URL.revokeObjectURL(url);
        this.notification.success('Report downloaded successfully.');
      },
    });
  }
}
