import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidoAdicionarComponent } from './adicionar/adicionar.component';
import { PedidoConsultarComponent } from './consultar/consultar.component';
import { PedidoFuncionarioComponent } from './funcionario/funcionario.component';
import { PedidoFornecedorComponent } from './fornecedor/fornecedor.component';
import { PedidoFornecedorConsultarComponent } from './fornecedor-consultar/fornecedor-consultar.component';
import { PedidoFuncionarioConsultarComponent } from './funcionario-consultar/funcionario-consultar.component';

const routes: Routes = [{ path: 'adicionar', component: PedidoAdicionarComponent },
{ path: 'adicionar/:id', component: PedidoAdicionarComponent },
{ path: 'consultar', component: PedidoConsultarComponent },
{ path: 'funcionario', component: PedidoFuncionarioComponent },
{ path: 'fornecedor', component: PedidoFornecedorComponent },
{ path: 'fornecedor-consultar', component: PedidoFornecedorConsultarComponent },
{ path: 'funcionario-consultar', component: PedidoFuncionarioConsultarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
