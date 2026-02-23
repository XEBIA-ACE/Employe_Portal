import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const ATTENDANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./attendance.component').then((m) => m.AttendanceComponent)
  }
];
