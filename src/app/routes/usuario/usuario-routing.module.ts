import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioContaComponent } from './conta/conta.component';
import { UsuarioEditarComponent } from './editar/editar.component';
import { UsuarioRegisterComponent } from './register/register.component';

const routes: Routes = [{ path: 'conta', component: UsuarioContaComponent },
{ path: 'editar', component: UsuarioEditarComponent },
{ path: 'editar/:id', component: UsuarioEditarComponent },
{ path: 'conta/:id', component: UsuarioContaComponent },
{ path: 'conta/:id/:idConta', component: UsuarioContaComponent },
{ path: 'register', component: UsuarioRegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
