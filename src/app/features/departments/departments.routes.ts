import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const DEPARTMENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'hr_manager'] },
    loadComponent: () =>
      import('./departments.component').then((m) => m.DepartmentsComponent)
  }
];
