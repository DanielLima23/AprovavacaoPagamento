import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdministracaoRoutingModule } from './administracao-routing.module';
import { AdministracaoUsuariosComponent } from './usuarios/usuarios.component';
import { AdministracaoAprovarUsuariosComponent } from './aprovar-usuarios/aprovar-usuarios.component';
import { AdministracaoConvidarComponent } from './convidar/convidar.component';

const COMPONENTS: any[] = [AdministracaoUsuariosComponent, AdministracaoAprovarUsuariosComponent, AdministracaoConvidarComponent];
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
