import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Department } from '../../../core/models/department.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  isLoading = true;
  searchTerm = '';

  readonly UserRole = UserRole;

  constructor(
    private departmentService: DepartmentService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe({
      next: (depts) => {
        this.departments = depts;
        this.applySearch();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDepartments = this.departments;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter(
      d => d.name.toLowerCase().includes(term) || d.code.toLowerCase().includes(term),
    );
  }

  editDepartment(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/departments', id, 'edit']);
  }

  deleteDepartment(dept: Department, event: Event): void {
    event.stopPropagation();

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Department',
        message: `Are you sure you want to delete the "${dept.name}" department? Employees in this department will become unassigned.`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.departmentService.deleteDepartment(dept.id).subscribe({
        next: () => {
          this.notification.success(`"${dept.name}" department deleted.`);
          this.loadDepartments();
        },
      });
    });
  }
}
