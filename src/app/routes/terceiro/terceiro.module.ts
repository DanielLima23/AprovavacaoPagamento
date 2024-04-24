import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { TerceiroRoutingModule } from './terceiro-routing.module';
import { TerceiroConsultarComponent } from './consultar/consultar.component';
import { TerceiroAdicionarComponent } from './adicionar/adicionar.component';

const COMPONENTS: any[] = [TerceiroConsultarComponent, TerceiroAdicionarComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    TerceiroRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class TerceiroModule { }
