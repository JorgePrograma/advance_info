import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () =>
          loadRemoteModule('mfe-user-management', './routes').then((m) => m.APP_ROUTES),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      loadRemoteModule('sgdea-login', './routes').then((m) => m.APP_ROUTES),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
