import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { RoleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

const routes: Routes = [
  { path: '', component: DepartmentListComponent },
  {
    path: 'new',
    component: DepartmentFormComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] },
  },
  {
    path: ':id/edit',
    component: DepartmentFormComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
