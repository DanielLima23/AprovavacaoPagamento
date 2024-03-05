import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FornecedorRoutingModule } from './fornecedor-routing.module';
import { FornecedorAdicionarComponent } from './adicionar/adicionar.component';
import { FornecedorConsultarComponent } from './consultar/consultar.component';
import { FornecedorContaComponent } from './conta/conta.component';

const COMPONENTS: any[] = [FornecedorAdicionarComponent, FornecedorConsultarComponent, FornecedorContaComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    FornecedorRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  
})
export class FornecedorModule { }
