import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./employee-list/employee-list.component').then((m) => m.EmployeeListComponent)
  },
  {
    path: 'new',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'hr_manager'] },
    loadComponent: () =>
      import('./employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./employee-detail/employee-detail.component').then((m) => m.EmployeeDetailComponent)
  },
  {
    path: ':id/edit',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'hr_manager'] },
    loadComponent: () =>
      import('./employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
  }
];
