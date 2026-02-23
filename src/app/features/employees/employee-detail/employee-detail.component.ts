import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = true;
  activeTab: 'overview' | 'contact' | 'history' = 'overview';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/employees']);
      return;
    }
    this.loadEmployee(id);
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        this.employee = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.notifications.error('Employee not found.');
        this.router.navigate(['/employees']);
      },
    });
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/employees', this.employee.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  setTab(tab: 'overview' | 'contact' | 'history'): void {
    this.activeTab = tab;
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.firstName[0]}${this.employee.lastName[0]}`;
  }
}
