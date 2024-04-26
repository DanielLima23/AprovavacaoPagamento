import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoAdicionarComponent } from './adicionar/adicionar.component';
import { PedidoConsultarComponent } from './consultar/consultar.component';
import { DatePipe } from '@angular/common';
import { PedidoFuncionarioComponent } from './funcionario/funcionario.component';
import { PedidoFornecedorComponent } from './fornecedor/fornecedor.component';
import { PedidoFornecedorConsultarComponent } from './fornecedor-consultar/fornecedor-consultar.component';
import { PedidoFuncionarioConsultarComponent } from './funcionario-consultar/funcionario-consultar.component';

const COMPONENTS: any[] = [PedidoAdicionarComponent, PedidoConsultarComponent, PedidoFuncionarioComponent, PedidoFornecedorComponent, PedidoFornecedorConsultarComponent, PedidoFuncionarioConsultarComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    PedidoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  providers:[DatePipe],
  exports:[PedidoConsultarComponent]
})
export class PedidoModule { }
