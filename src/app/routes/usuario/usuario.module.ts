import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioContaComponent } from './conta/conta.component';
import { UsuarioEditarComponent } from './editar/editar.component';
import { UsuarioRegisterComponent } from './register/register.component';

const COMPONENTS: any[] = [UsuarioContaComponent, UsuarioEditarComponent, UsuarioRegisterComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    UsuarioRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class UsuarioModule { }
