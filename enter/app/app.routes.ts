import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/user-list/component/user-table/user-table.component').then(
            m => m.UserTableComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/create/component/user-registration/user-registration.component').then(
            m => m.UserRegistrationComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./features/update/update.component').then(
            m => m.UpdateComponent
          ),
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
