import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DialogRoutingModule } from './dialog-routing.module';
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
import { DatePipe } from '@angular/common';
import { DialogAddContaFuncionarioComponent } from './add-conta-funcionario/add-conta-funcionario.component';
import { DialogParcelasNaoAprovadasComponent } from './parcelas-nao-aprovadas/parcelas-nao-aprovadas.component';
import { DialogPedidosPorParcelaComponent } from './pedidos-por-parcela/pedidos-por-parcela.component';
import { PedidoModule } from '../pedido/pedido.module';
import { DialogPedidosPorParcelaFuncionarioComponent } from './pedidos-por-parcela-funcionario/pedidos-por-parcela-funcionario.component';
import { DialogObservacaoComponent } from './observacao/observacao.component';

const COMPONENTS: any[] = [DialogEditParcelaDialogComponent, DialogEditRateioDialogComponent, DialogEditCentroCustoDialogComponent, DialogEditFornecedorDialogComponent, DialogEditContaUsuarioDialogComponent, DialogEditContaTerceiroDialogComponent, DialogEditUsuarioRegisterContaComponent, DialogLogoutComponent, DialogConfirmarExclusaoComponent, DialogTrocaSenhaPrimeiroAcessoComponent, DialogTermosSegurancaComponent, DialogAddContaUsuarioComponent, DialogConfirmacaoComponent, DialogPedidosAgendadorsFinanceiroComponent, DialogAddContaFuncionarioComponent, DialogParcelasNaoAprovadasComponent, DialogPedidosPorParcelaComponent, DialogPedidosPorParcelaFuncionarioComponent, DialogObservacaoComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    DialogRoutingModule,
    PedidoModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class DialogModule { }
