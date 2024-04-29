import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioContaComponent } from './conta/conta.component';
import { UsuarioEditarComponent } from './editar/editar.component';
import { UsuarioRegisterComponent } from './register/register.component';
import { authGuard } from '@core/authentication/auth.guard';

const routes: Routes = [{ path: 'conta', component: UsuarioContaComponent },
{ path: 'editar', component: UsuarioEditarComponent,canActivate: [authGuard],  data: { roles: [0,1,2,3,4] } },
{ path: 'editar/:id', component: UsuarioEditarComponent,canActivate: [authGuard],  data: { roles: [0,1,2,3,4] } },
{ path: 'conta/:id', component: UsuarioContaComponent,canActivate: [authGuard],  data: { roles: [0,1,2,3,4] } },
{ path: 'conta/:id/:idConta', component: UsuarioContaComponent,canActivate: [authGuard],  data: { roles: [0,1,2,3,4] } },
{ path: 'register', component: UsuarioRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
