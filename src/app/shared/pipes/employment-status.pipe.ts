import { Pipe, PipeTransform } from '@angular/core';
import { EmploymentStatus } from '@core/models/employee.model';

const STATUS_LABELS: Record<EmploymentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  on_leave: 'On Leave',
  terminated: 'Terminated'
};

/** Formats EmploymentStatus enum values to human-readable labels */
@Pipe({ name: 'employmentStatus', standalone: true })
export class EmploymentStatusPipe implements PipeTransform {
  transform(status: EmploymentStatus): string {
    return STATUS_LABELS[status] ?? status;
  }
}
