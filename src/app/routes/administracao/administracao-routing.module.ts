import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracaoUsuariosListaComponent } from './usuarios/lista/lista.component';
import { AdministracaoUsuariosConvidarComponent } from './usuarios/convidar/convidar.component';
import { AdministracaoUsuariosPendentesAprovacaoComponent } from './usuarios/pendentes-aprovacao/pendentes-aprovacao.component';
import { AdministracaoUsuariosAprovarComponent } from './usuarios/aprovar/aprovar.component';
import { AdministracaoUsuariosEditarComponent } from './usuarios/editar/editar.component';
import { AdministracaoCeoCeoAprovacaoPendenteComponent } from './ceo/ceo-aprovacao-pendente/ceo-aprovacao-pendente.component';
import { AdministracaoCeoCeoAprovarComponent } from './ceo/ceo-aprovar/ceo-aprovar.component';
import { AdministracaoDiretorDiretorAprovacaoPendenteComponent } from './diretor/diretor-aprovacao-pendente/diretor-aprovacao-pendente.component';
import { AdministracaoDiretorDiretorAprovarComponent } from './diretor/diretor-aprovar/diretor-aprovar.component';
import { AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent } from './financeiro/financeiro-aprovacao-pendente/financeiro-aprovacao-pendente.component';
import { AdministracaoFinanceiroFinanceiroAprovarComponent } from './financeiro/financeiro-aprovar/financeiro-aprovar.component';
import { AdministracaoResponsavelCentroResponsavelAprovacaoPendenteComponent } from './responsavel-centro/responsavel-aprovacao-pendente/responsavel-aprovacao-pendente.component';
import { AdministracaoResponsavelCentroResponsavelAprovarComponent } from './responsavel-centro/responsavel-aprovar/responsavel-aprovar.component';
import { AdministracaoTerceirosFuncionarioFuncionarioConsultarComponent } from './terceiros/funcionario/funcionario-consultar/funcionario-consultar.component';
import { AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent } from './terceiros/funcionario/funcionario-adicionar/funcionario-adicionar.component';
import { AdministracaoTerceirosFornecedorFornecedorAdicionarComponent } from './terceiros/fornecedor/fornecedor-adicionar/fornecedor-adicionar.component';
import { AdministracaoTerceirosFornecedorFornecedorConsultarComponent } from './terceiros/fornecedor/fornecedor-consultar/fornecedor-consultar.component';
import { AdministracaoCentroDeCustoCentroDeCustoConsultarComponent } from './centro-de-custo/centro-de-custo-consultar/centro-de-custo-consultar.component';
import { AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent } from './centro-de-custo/centro-de-custo-adicionar/centro-de-custo-adicionar.component';
import { AdministracaoTerceirosFornecedorFornecedorContaComponent } from './terceiros/fornecedor/fornecedor-conta/fornecedor-conta.component';
import { AdministracaoTerceirosFuncionarioFuncionarioContaComponent } from './terceiros/funcionario/funcionario-conta/funcionario-conta.component';
import { AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent } from './financeiro/financeiro-pagamentos-agendados/financeiro-pagamentos-agendados.component';
import { authGuard } from '@core';
import { AdministracaoRelatoriosRelatorioPedidoComponent } from './relatorios/relatorio-pedido/relatorio-pedido.component';
import { AdministracaoResponsavelCentroResponsavelAprovarTerceiroComponent } from './responsavel-centro/responsavel-aprovar-terceiro/responsavel-aprovar-terceiro.component';
import { AdministracaoFinanceiroFinanceiroAprovarTerceiroComponent } from './financeiro/financeiro-aprovar-terceiro/financeiro-aprovar-terceiro.component';
import { AdministracaoCeoCeoAprovarTerceiroComponent } from './ceo/ceo-aprovar-terceiro/ceo-aprovar-terceiro.component';
import { AdministracaoDiretorDiretorAprovarTerceiroComponent } from './diretor/diretor-aprovar-terceiro/diretor-aprovar-terceiro.component';
import { AdministracaoRelatoriosRelatorioPagamentoComponent } from './relatorios/relatorio-pagamento/relatorio-pagamento.component';

const routes: Routes = [{ path: 'lista', component: AdministracaoUsuariosListaComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'convidar', component: AdministracaoUsuariosConvidarComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'pendentes-aprovacao', component: AdministracaoUsuariosPendentesAprovacaoComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'aprovar', component: AdministracaoUsuariosAprovarComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'aprovar/:id', component: AdministracaoUsuariosAprovarComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'editar', component: AdministracaoUsuariosEditarComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'editar/:id', component: AdministracaoUsuariosEditarComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },

{ path: 'ceo-aprovacao-pendente', component: AdministracaoCeoCeoAprovacaoPendenteComponent, canActivate: [authGuard],  data: { roles: [3] } },
{ path: 'ceo-aprovar', component: AdministracaoCeoCeoAprovarComponent,canActivate: [authGuard],  data: { roles: [3] } },
{ path: 'ceo-aprovar/:id', component: AdministracaoCeoCeoAprovarComponent,canActivate: [authGuard],  data: { roles: [3] } },
{ path: 'ceo-aprovar-terceiro', component: AdministracaoCeoCeoAprovarTerceiroComponent,canActivate: [authGuard],  data: { roles: [3] } },
{ path: 'ceo-aprovar-terceiro/:id', component: AdministracaoCeoCeoAprovarTerceiroComponent,canActivate: [authGuard],  data: { roles: [3] } },


{ path: 'diretor-aprovacao-pendente', component: AdministracaoDiretorDiretorAprovacaoPendenteComponent,canActivate: [authGuard],  data: { roles: [4] } },
{ path: 'diretor-aprovar', component: AdministracaoDiretorDiretorAprovarComponent,canActivate: [authGuard],  data: { roles: [4] } },
{ path: 'diretor-aprovar/:id', component: AdministracaoDiretorDiretorAprovarComponent,canActivate: [authGuard],  data: { roles: [4] } },
{ path: 'diretor-aprovar-terceiro', component: AdministracaoDiretorDiretorAprovarTerceiroComponent,canActivate: [authGuard],  data: { roles: [4] }  },
{ path: 'diretor-aprovar-terceiro/:id', component: AdministracaoDiretorDiretorAprovarTerceiroComponent,canActivate: [authGuard],  data: { roles: [4] }  },


{
  path: 'financeiro-aprovacao-pendente', component: AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent, canActivate: [authGuard],  data: { roles: [1] }},
{ path: 'financeiro-aprovar', component: AdministracaoFinanceiroFinanceiroAprovarComponent, canActivate: [authGuard],  data: { roles: [1] } },
{ path: 'financeiro-aprovar/:id', component: AdministracaoFinanceiroFinanceiroAprovarComponent, canActivate: [authGuard],  data: { roles: [1] } },
{ path: 'financeiro-pagamentos-agendados', component: AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent, canActivate: [authGuard],  data: { roles: [1] } },
{ path: 'financeiro-aprovar-terceiro', component: AdministracaoFinanceiroFinanceiroAprovarTerceiroComponent, canActivate: [authGuard],  data: { roles: [1] }},
{ path: 'financeiro-aprovar-terceiro/:id', component: AdministracaoFinanceiroFinanceiroAprovarTerceiroComponent, canActivate: [authGuard],  data: { roles: [1] }},


{ path: 'responsavel-aprovacao-pendente', component: AdministracaoResponsavelCentroResponsavelAprovacaoPendenteComponent,canActivate: [authGuard],  data: { roles: [6] } },
{ path: 'responsavel-aprovar', component: AdministracaoResponsavelCentroResponsavelAprovarComponent,canActivate: [authGuard],  data: { roles: [6] } },
{ path: 'responsavel-aprovar/:id', component: AdministracaoResponsavelCentroResponsavelAprovarComponent,canActivate: [authGuard],  data: { roles: [6] } },
{ path: 'responsavel-aprovar-terceiro', component: AdministracaoResponsavelCentroResponsavelAprovarTerceiroComponent,canActivate: [authGuard],  data: { roles: [6] }  },
{ path: 'responsavel-aprovar-terceiro/:id', component: AdministracaoResponsavelCentroResponsavelAprovarTerceiroComponent,canActivate: [authGuard],  data: { roles: [6] }  },


{ path: 'funcionario-consultar', component: AdministracaoTerceirosFuncionarioFuncionarioConsultarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'funcionario-adicionar', component: AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'funcionario-adicionar/:id', component: AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },

{ path: 'fornecedor-adicionar', component: AdministracaoTerceirosFornecedorFornecedorAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'fornecedor-adicionar/:id', component: AdministracaoTerceirosFornecedorFornecedorAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'fornecedor-consultar', component: AdministracaoTerceirosFornecedorFornecedorConsultarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },

{ path: 'centro-de-custo-consultar', component: AdministracaoCentroDeCustoCentroDeCustoConsultarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'centro-de-custo-adicionar', component: AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'centro-de-custo-adicionar/:id', component: AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },

{ path: 'fornecedor-conta', component: AdministracaoTerceirosFornecedorFornecedorContaComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'fornecedor-conta/:id', component: AdministracaoTerceirosFornecedorFornecedorContaComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'fornecedor-conta/:id/:idConta', component: AdministracaoTerceirosFornecedorFornecedorContaComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },

{ path: 'funcionario-conta', component: AdministracaoTerceirosFuncionarioFuncionarioContaComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'funcionario-conta/:id', component: AdministracaoTerceirosFuncionarioFuncionarioContaComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'funcionario-conta/:id/:idConta', component: AdministracaoTerceirosFuncionarioFuncionarioContaComponent,canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'relatorio-pedido', component: AdministracaoRelatoriosRelatorioPedidoComponent, canActivate: [authGuard],  data: { roles: [0,1,3,4] } },
{ path: 'relatorio-pagamento', component: AdministracaoRelatoriosRelatorioPagamentoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
