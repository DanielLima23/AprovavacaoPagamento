import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '../theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '../theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { authGuard } from '@core';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      {
        path: 'centro-de-custo',
        loadChildren: () =>
          import('./centro-de-custo/centro-de-custo.module').then(m => m.CentroDeCustoModule),
      },
      {
        path: 'pedido',
        loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule),
      },
      {
        path: 'usuario',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      { path: 'fornecedor', loadChildren: () => import('./fornecedor/fornecedor.module').then(m => m.FornecedorModule) },
      { path: 'dialog', loadChildren: () => import('./dialog/dialog.module').then(m => m.DialogModule) },
  { path: 'administracao', loadChildren: () => import('./administracao/administracao.module').then(m => m.AdministracaoModule) },

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