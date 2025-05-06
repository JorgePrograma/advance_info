import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
   // canActivate: [AuthGuard],
    children: [
      {
        path: 'roles_lista',
        loadChildren: () =>
          loadRemoteModule('mfe-panel-user', './routes').then((m) => m.APP_ROUTES),
      },
     /* {
        path: 'grupos',
        loadChildren: () =>
          loadRemoteModule('mfe-admin-console-group-management', './routes').then((m) => m.APP_ROUTES),
      },*/
      {
        path: 'usuarios',
        loadChildren: () =>
          loadRemoteModule('mfe-user-management', './routes').then((m) => m.APP_ROUTES),
      },
   /*   {
        path: 'permisos',
        loadChildren: () =>
          loadRemoteModule('mf-filing-enter', './routes').then((m) => m.APP_ROUTES),
      },*/
      {
        path: '',
        loadChildren: () =>
          loadRemoteModule('mfe-role-manager', './routes').then((m) => m.APP_ROUTES),
      },
      {
        path: 'roles_crear',
        loadChildren: () =>
          loadRemoteModule('mfe-role-create', './routes').then((m) => m.APP_ROUTES),
      },
   /*   {
        path: 'seguridad',
        loadChildren: () =>
          loadRemoteModule('mfe-security-passwords', './routes').then((m) => m.APP_ROUTES),
      },*/
    ],
  },
  {
    path: '**',
    redirectTo: ''
  }
];
