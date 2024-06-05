import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogEditParcelaDialogComponent } from './edit-parcela-dialog/edit-parcela-dialog.component';
import { DialogEditRateioDialogComponent } from './edit-rateio-dialog/edit-rateio-dialog.component';
import { DialogEditCentroCustoDialogComponent } from './edit-centro-custo-dialog/edit-centro-custo-dialog.component';
import { DialogEditFornecedorDialogComponent } from './edit-fornecedor-dialog/edit-fornecedor-dialog.component';
import { DialogEditContaUsuarioDialogComponent } from './edit-conta-usuario-dialog/edit-conta-usuario-dialog.component';
import { DialogEditContaTerceiroDialogComponent } from './edit-conta-terceiro-dialog/edit-conta-terceiro-dialog.component';
import { DialogEditUsuarioRegisterContaComponent } from './edit-usuario-register-conta/edit-usuario-register-conta.component';
import { DialogLogoutComponent } from './logout/logout.component';
import { DialogConfirmarExclusaoComponent } from './confirmar-exclusao/confirmar-exclusao.component';
import { DialogTrocaSenhaPrimeiroAcessoComponent } from './troca-senha-primeiro-acesso/troca-senha-primeiro-acesso.component';
import { DialogTermosSegurancaComponent } from './termos-seguranca/termos-seguranca.component';
import { DialogAddContaUsuarioComponent } from './add-conta-usuario/add-conta-usuario.component';
import { DialogConfirmacaoComponent } from './confirmacao/confirmacao.component';
import { DialogPedidosAgendadorsFinanceiroComponent } from './pedidos-agendadors-financeiro/pedidos-agendadors-financeiro.component';
import { DialogAddContaFuncionarioComponent } from './add-conta-funcionario/add-conta-funcionario.component';
import { DialogParcelasNaoAprovadasComponent } from './parcelas-nao-aprovadas/parcelas-nao-aprovadas.component';
import { DialogPedidosPorParcelaComponent } from './pedidos-por-parcela/pedidos-por-parcela.component';
import { DialogPedidosPorParcelaFuncionarioComponent } from './pedidos-por-parcela-funcionario/pedidos-por-parcela-funcionario.component';
import { DialogObservacaoComponent } from './observacao/observacao.component';
import { DialogPedidosPorParcelaFornecedorComponent } from './pedidos-por-parcela-fornecedor/pedidos-por-parcela-fornecedor.component';
import { DialogPedidosPorParcelaOutrosUsuariosComponent } from './pedidos-por-parcela-outros-usuarios/pedidos-por-parcela-outros-usuarios.component';

const routes: Routes = [{ path: 'edit-parcela-dialog', component: DialogEditParcelaDialogComponent },
{ path: 'edit-rateio-dialog', component: DialogEditRateioDialogComponent },
{ path: 'edit-centro-custo-dialog', component: DialogEditCentroCustoDialogComponent },
{ path: 'edit-fornecedor-dialog', component: DialogEditFornecedorDialogComponent },
{ path: 'edit-conta-usuario-dialog', component: DialogEditContaUsuarioDialogComponent },
{ path: 'edit-conta-terceiro-dialog', component: DialogEditContaTerceiroDialogComponent },
{ path: 'edit-usuario-register-conta', component: DialogEditUsuarioRegisterContaComponent },
{ path: 'logout', component: DialogLogoutComponent },
{ path: 'confirmar-exclusao', component: DialogConfirmarExclusaoComponent },
{ path: 'troca-senha-primeiro-acesso', component: DialogTrocaSenhaPrimeiroAcessoComponent },
{ path: 'termos-seguranca', component: DialogTermosSegurancaComponent },
{ path: 'add-conta-usuario', component: DialogAddContaUsuarioComponent },
{ path: 'confirmacao', component: DialogConfirmacaoComponent },
{ path: 'pedidos-agendadors-financeiro', component: DialogPedidosAgendadorsFinanceiroComponent },
{ path: 'add-conta-funcionario', component: DialogAddContaFuncionarioComponent },
{ path: 'parcelas-nao-aprovadas', component: DialogParcelasNaoAprovadasComponent },
{ path: 'pedidos-por-parcela', component: DialogPedidosPorParcelaComponent },
{ path: 'pedidos-por-parcela-funcionario', component: DialogPedidosPorParcelaFuncionarioComponent },
{ path: 'observacao', component: DialogObservacaoComponent },
{ path: 'pedidos-por-parcela-fornecedor', component: DialogPedidosPorParcelaFornecedorComponent },
{ path: 'pedidos-por-parcela-outrosUsuarios', component: DialogPedidosPorParcelaOutrosUsuariosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DialogRoutingModule { }
