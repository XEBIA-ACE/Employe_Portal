import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeDetailComponent,
  ],
  imports: [SharedModule, EmployeesRoutingModule],
})
export class EmployeesModule {}
