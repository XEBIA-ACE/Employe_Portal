import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Auth routes (only for unauthenticated users)
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
        title: 'Sign In — Employee Portal',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
        title: 'Register — Employee Portal',
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // Protected routes (require authentication)
  {
    path: '',
    component: undefined, // Shell layout is set in AppComponent
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard — Employee Portal',
      },
      {
        path: 'employees',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/employees/employee-list/employee-list.component').then(
                (m) => m.EmployeeListComponent,
              ),
            title: 'Employees — Employee Portal',
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/employees/employee-form/employee-form.component').then(
                (m) => m.EmployeeFormComponent,
              ),
            title: 'New Employee — Employee Portal',
            data: { roles: ['admin', 'hr-manager'] },
            canActivate: [authGuard],
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/employees/employee-detail/employee-detail.component').then(
                (m) => m.EmployeeDetailComponent,
              ),
            title: 'Employee Detail — Employee Portal',
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/employees/employee-form/employee-form.component').then(
                (m) => m.EmployeeFormComponent,
              ),
            title: 'Edit Employee — Employee Portal',
            data: { roles: ['admin', 'hr-manager', 'manager'] },
            canActivate: [authGuard],
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
        title: 'My Profile — Employee Portal',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then((m) => m.ReportsComponent),
        title: 'Reports — Employee Portal',
        data: { roles: ['admin', 'hr-manager', 'manager'] },
        canActivate: [authGuard],
      },
    ],
  },

  // Catch-all 404
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
