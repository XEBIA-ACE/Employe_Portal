import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { RoleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeFormComponent, canActivate: [RoleGuard], data: { roles: [UserRole.ADMIN, UserRole.HR] } },
  { path: ':id', component: EmployeeDetailComponent },
  { path: ':id/edit', component: EmployeeFormComponent, canActivate: [RoleGuard], data: { roles: [UserRole.ADMIN, UserRole.HR] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
