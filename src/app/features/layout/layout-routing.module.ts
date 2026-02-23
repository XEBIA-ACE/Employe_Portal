import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { RoleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('../employees/employees.module').then(m => m.EmployeesModule),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.HR] },
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('../departments/departments.module').then(m => m.DepartmentsModule),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.HR] },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
