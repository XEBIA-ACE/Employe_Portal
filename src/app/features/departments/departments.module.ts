import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';

@NgModule({
  declarations: [DepartmentListComponent, DepartmentFormComponent],
  imports: [SharedModule, DepartmentsRoutingModule],
})
export class DepartmentsModule {}
