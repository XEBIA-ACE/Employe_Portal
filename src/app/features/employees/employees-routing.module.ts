import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeFormComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'hr_manager'] } },
  { path: ':id', component: EmployeeDetailComponent },
  { path: ':id/edit', component: EmployeeFormComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'hr_manager'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
