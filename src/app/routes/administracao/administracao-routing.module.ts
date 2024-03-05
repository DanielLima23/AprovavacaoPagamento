import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracaoUsuariosComponent } from './usuarios/usuarios.component';
import { AdministracaoAprovarUsuariosComponent } from './aprovar-usuarios/aprovar-usuarios.component';

const routes: Routes = [{ path: 'usuarios', component: AdministracaoUsuariosComponent },
{ path: 'aprovar-usuarios', component: AdministracaoAprovarUsuariosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
