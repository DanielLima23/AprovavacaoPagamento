import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdministracaoRoutingModule } from './administracao-routing.module';
import { AdministracaoUsuariosComponent } from './usuarios/usuarios.component';
import { AdministracaoAprovarUsuariosComponent } from './aprovar-usuarios/aprovar-usuarios.component';

const COMPONENTS: any[] = [AdministracaoUsuariosComponent, AdministracaoAprovarUsuariosComponent];
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
