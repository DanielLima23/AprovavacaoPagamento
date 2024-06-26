import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@env/environment';

import { authGuard } from '@core';
import { AdminLayoutComponent } from '../theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '../theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [authGuard],
    // canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent,canActivate: [authGuard],  data: { roles: [0,1,2,3,4,6] } },
      { path: '403', component: Error403Component,canActivate: [authGuard],  data: { roles: [0,1,2,3,4,6] } },
      { path: '404', component: Error404Component,canActivate: [authGuard],  data: { roles: [0,1,2,3,4,6] } },
      { path: '500', component: Error500Component,canActivate: [authGuard],  data: { roles: [0,1,2,3,4,6] } },

      {
        path: 'pedido',
        loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule),
      },
      {
        path: 'usuario',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      { path: 'dialog', loadChildren: () => import('./dialog/dialog.module').then(m => m.DialogModule) },
      { path: 'administracao', loadChildren: () => import('./administracao/administracao.module').then(m => m.AdministracaoModule)},

    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/:id', component: RegisterComponent },

    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule { }
