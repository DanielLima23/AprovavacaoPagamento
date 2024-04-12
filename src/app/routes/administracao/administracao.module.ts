import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdministracaoRoutingModule } from './administracao-routing.module';
import { AdministracaoUsuariosListaComponent } from './usuarios/lista/lista.component';
import { AdministracaoUsuariosConvidarComponent } from './usuarios/convidar/convidar.component';
import { AdministracaoUsuariosPendentesAprovacaoComponent } from './usuarios/pendentes-aprovacao/pendentes-aprovacao.component';
import { AdministracaoUsuariosAprovarComponent } from './usuarios/aprovar/aprovar.component';
import { AdministracaoUsuariosEditarComponent } from './usuarios/editar/editar.component';

const COMPONENTS: any[] = [AdministracaoUsuariosListaComponent, AdministracaoUsuariosConvidarComponent, AdministracaoUsuariosPendentesAprovacaoComponent, AdministracaoUsuariosAprovarComponent, AdministracaoUsuariosEditarComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    AdministracaoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class AdministracaoModule { }
