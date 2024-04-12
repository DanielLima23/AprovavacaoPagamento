import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracaoUsuariosListaComponent } from './usuarios/lista/lista.component';
import { AdministracaoUsuariosConvidarComponent } from './usuarios/convidar/convidar.component';
import { AdministracaoUsuariosPendentesAprovacaoComponent } from './usuarios/pendentes-aprovacao/pendentes-aprovacao.component';
import { AdministracaoUsuariosAprovarComponent } from './usuarios/aprovar/aprovar.component';
import { AdministracaoUsuariosEditarComponent } from './usuarios/editar/editar.component';

const routes: Routes = [{ path: 'lista', component: AdministracaoUsuariosListaComponent },
{ path: 'convidar', component: AdministracaoUsuariosConvidarComponent },
{ path: 'pendentes-aprovacao', component: AdministracaoUsuariosPendentesAprovacaoComponent },
{ path: 'aprovar', component: AdministracaoUsuariosAprovarComponent },
{ path: 'aprovar/:id', component: AdministracaoUsuariosAprovarComponent },
{ path: 'editar', component: AdministracaoUsuariosEditarComponent },
{ path: 'editar/:id', component: AdministracaoUsuariosEditarComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
