import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracaoUsuariosComponent } from './usuarios/usuarios.component';
import { AdministracaoAprovarUsuariosComponent } from './aprovar-usuarios/aprovar-usuarios.component';
import { AdministracaoConvidarComponent } from './convidar/convidar.component';

const routes: Routes = [{ path: 'usuarios', component: AdministracaoUsuariosComponent },
{ path: 'aprovar-usuarios', component: AdministracaoAprovarUsuariosComponent },
{ path: 'convidar', component: AdministracaoConvidarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
