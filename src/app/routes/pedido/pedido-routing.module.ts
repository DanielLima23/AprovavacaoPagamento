import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidoAdicionarComponent } from './adicionar/adicionar.component';
import { PedidoConsultarComponent } from './consultar/consultar.component';
import { PedidoFuncionarioComponent } from './funcionario/funcionario.component';
import { PedidoFornecedorComponent } from './fornecedor/fornecedor.component';
import { PedidoFornecedorConsultarComponent } from './fornecedor-consultar/fornecedor-consultar.component';
import { PedidoFuncionarioConsultarComponent } from './funcionario-consultar/funcionario-consultar.component';
import { authGuard } from '@core/authentication/auth.guard';
import { PedidoUsuarioComponent } from './usuario/usuario.component';
import { PedidoUsuarioConsultarComponent } from './usuario-consultar/usuario-consultar.component';

const routes: Routes = [{ path: 'adicionar', component: PedidoAdicionarComponent },
{ path: 'adicionar/:id', component: PedidoAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,2,3,4] }},
{ path: 'consultar', component: PedidoConsultarComponent ,canActivate: [authGuard],  data: { roles: [0,1,2,3,4] }},
{ path: 'funcionario/:id', component: PedidoFuncionarioComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4,6] } },
{ path: 'funcionario', component: PedidoFuncionarioComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4,6] } },
{ path: 'fornecedor', component: PedidoFornecedorComponent, canActivate: [authGuard],  data: { roles: [0,1,2,3,4,6] } },
{ path: 'fornecedor-consultar', component: PedidoFornecedorConsultarComponent, canActivate: [authGuard],  data: { roles: [0,1,2,3,4,6] } },
{ path: 'funcionario-consultar', component: PedidoFuncionarioConsultarComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4,6] } },
{ path: 'usuario', component: PedidoUsuarioComponent },
{ path: 'usuario-consultar', component: PedidoUsuarioConsultarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
