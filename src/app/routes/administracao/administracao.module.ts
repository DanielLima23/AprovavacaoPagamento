import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdministracaoRoutingModule } from './administracao-routing.module';
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
import { DatePipe } from '@angular/common';
import { AdministracaoTerceirosFuncionarioFuncionarioConsultarComponent } from './terceiros/funcionario/funcionario-consultar/funcionario-consultar.component';
import { AdministracaoTerceirosFornecedorFornecedorAdicionarComponent } from './terceiros/fornecedor/fornecedor-adicionar/fornecedor-adicionar.component';
import { AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent } from './terceiros/funcionario/funcionario-adicionar/funcionario-adicionar.component';
import { AdministracaoTerceirosFornecedorFornecedorConsultarComponent } from './terceiros/fornecedor/fornecedor-consultar/fornecedor-consultar.component';
import { AdministracaoCentroDeCustoCentroDeCustoConsultarComponent } from './centro-de-custo/centro-de-custo-consultar/centro-de-custo-consultar.component';
import { AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent } from './centro-de-custo/centro-de-custo-adicionar/centro-de-custo-adicionar.component';
import { AdministracaoTerceirosFornecedorFornecedorContaComponent } from './terceiros/fornecedor/fornecedor-conta/fornecedor-conta.component';
import { AdministracaoTerceirosFuncionarioFuncionarioContaComponent } from './terceiros/funcionario/funcionario-conta/funcionario-conta.component';
import { AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent } from './financeiro/financeiro-pagamentos-agendados/financeiro-pagamentos-agendados.component';
import { AdministracaoRelatoriosRelatorioPedidoComponent } from './relatorios/relatorio-pedido/relatorio-pedido.component';

const COMPONENTS: any[] = [AdministracaoUsuariosListaComponent, AdministracaoUsuariosConvidarComponent, AdministracaoUsuariosPendentesAprovacaoComponent, AdministracaoUsuariosAprovarComponent, AdministracaoUsuariosEditarComponent, AdministracaoCeoCeoAprovacaoPendenteComponent, AdministracaoCeoCeoAprovarComponent, AdministracaoDiretorDiretorAprovacaoPendenteComponent, AdministracaoDiretorDiretorAprovarComponent, AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent, AdministracaoFinanceiroFinanceiroAprovarComponent, AdministracaoResponsavelCentroResponsavelAprovacaoPendenteComponent, AdministracaoResponsavelCentroResponsavelAprovarComponent, AdministracaoTerceirosFuncionarioFuncionarioConsultarComponent,AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent,AdministracaoTerceirosFornecedorFornecedorAdicionarComponent,AdministracaoTerceirosFornecedorFornecedorConsultarComponent, AdministracaoCentroDeCustoCentroDeCustoConsultarComponent, AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent, AdministracaoTerceirosFornecedorFornecedorContaComponent, AdministracaoTerceirosFuncionarioFuncionarioContaComponent, AdministracaoFinanceiroFinanceiroPagamentosAgendadosComponent,AdministracaoRelatoriosRelatorioPedidoComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    AdministracaoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  providers:[DatePipe]
})
export class AdministracaoModule { }
