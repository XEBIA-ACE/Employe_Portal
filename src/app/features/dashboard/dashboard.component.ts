import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { Employee, EmploymentStatus } from '../../core/models/employee.model';
import { Department } from '../../core/models/department.model';
import { DashboardStats, DepartmentStat, RecentHire } from '../../core/models/api-response.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  stats: DashboardStats | null = null;
  recentHires: RecentHire[] = [];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  private loadDashboardData(): void {
    forkJoin({
      employees: this.employeeService.getEmployees({ limit: 100 }),
      departments: this.departmentService.getDepartments(),
    }).subscribe({
      next: ({ employees, departments }) => {
        this.buildStats(employees.data, departments);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private buildStats(employees: Employee[], departments: Department[]): void {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeEmployees = employees.filter(e => e.employmentStatus === EmploymentStatus.ACTIVE);
    const newHires = employees.filter(e => new Date(e.hireDate) >= thisMonthStart);

    // Department breakdown
    const deptMap = new Map<string, number>();
    activeEmployees.forEach(e => {
      const name = e.departmentName ?? 'Unknown';
      deptMap.set(name, (deptMap.get(name) ?? 0) + 1);
    });

    const employeesByDepartment: DepartmentStat[] = Array.from(deptMap.entries()).map(([name, count]) => ({
      departmentName: name,
      count,
      percentage: activeEmployees.length > 0 ? Math.round((count / activeEmployees.length) * 100) : 0,
    }));

    // Recent hires (last 5)
    this.recentHires = [...employees]
      .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        name: `${e.firstName} ${e.lastName}`,
        jobTitle: e.jobTitle,
        departmentName: e.departmentName ?? '',
        hireDate: e.hireDate,
      }));

    // Employment type breakdown
    const typeMap = new Map<string, number>();
    activeEmployees.forEach(e => {
      const type = this.formatEmploymentType(e.employmentType);
      typeMap.set(type, (typeMap.get(type) ?? 0) + 1);
    });

    this.stats = {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      newHiresThisMonth: newHires.length,
      totalDepartments: departments.length,
      employeesByDepartment,
      recentHires: this.recentHires,
      employmentTypeBreakdown: Array.from(typeMap.entries()).map(([type, count]) => ({
        type,
        count,
        percentage: activeEmployees.length > 0 ? Math.round((count / activeEmployees.length) * 100) : 0,
      })),
    };
  }

  private formatEmploymentType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
