import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const LEAVE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./leave-list/leave-list.component').then((m) => m.LeaveListComponent)
  }
];
