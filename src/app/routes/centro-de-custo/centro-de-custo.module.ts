import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CentroDeCustoRoutingModule } from './centro-de-custo-routing.module';
import { CentroDeCustoConsultarComponent } from './consultar/consultar.component';
import { CentroDeCustoAdicionarComponent } from './adicionar/adicionar.component';

const COMPONENTS: any[] = [ CentroDeCustoConsultarComponent, CentroDeCustoAdicionarComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    CentroDeCustoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class CentroDeCustoModule { }
