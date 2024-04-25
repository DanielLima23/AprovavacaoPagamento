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

const routes: Routes = [{ path: 'lista', component: AdministracaoUsuariosListaComponent },
{ path: 'convidar', component: AdministracaoUsuariosConvidarComponent },
{ path: 'pendentes-aprovacao', component: AdministracaoUsuariosPendentesAprovacaoComponent },
{ path: 'aprovar', component: AdministracaoUsuariosAprovarComponent },
{ path: 'aprovar/:id', component: AdministracaoUsuariosAprovarComponent },
{ path: 'editar', component: AdministracaoUsuariosEditarComponent },
{ path: 'editar/:id', component: AdministracaoUsuariosEditarComponent },
{ path: 'ceo-aprovacao-pendente', component: AdministracaoCeoCeoAprovacaoPendenteComponent },
{ path: 'ceo-aprovar', component: AdministracaoCeoCeoAprovarComponent },
{ path: 'ceo-aprovar/:id', component: AdministracaoCeoCeoAprovarComponent },
{ path: 'diretor-aprovacao-pendente', component: AdministracaoDiretorDiretorAprovacaoPendenteComponent },
{ path: 'diretor-aprovar', component: AdministracaoDiretorDiretorAprovarComponent },
{ path: 'diretor-aprovar/:id', component: AdministracaoDiretorDiretorAprovarComponent },
{ path: 'financeiro-aprovacao-pendente', component: AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent },
{ path: 'financeiro-aprovar', component: AdministracaoFinanceiroFinanceiroAprovarComponent },
{ path: 'financeiro-aprovar/:id', component: AdministracaoFinanceiroFinanceiroAprovarComponent },
{ path: 'responsavel-aprovacao-pendente', component: AdministracaoResponsavelCentroResponsavelAprovacaoPendenteComponent },
{ path: 'responsavel-aprovar', component: AdministracaoResponsavelCentroResponsavelAprovarComponent },
{ path: 'responsavel-aprovar/:id', component: AdministracaoResponsavelCentroResponsavelAprovarComponent },
{ path: 'funcionario-consultar', component: AdministracaoTerceirosFuncionarioFuncionarioConsultarComponent },
{ path: 'funcionario-adicionar', component: AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent },
{ path: 'funcionario-adicionar/:id', component: AdministracaoTerceirosFuncionarioFuncionarioAdicionarComponent },
{ path: 'fornecedor-adicionar', component: AdministracaoTerceirosFornecedorFornecedorAdicionarComponent },
{ path: 'fornecedor-adicionar/:id', component: AdministracaoTerceirosFornecedorFornecedorAdicionarComponent },
{ path: 'fornecedor-consultar', component: AdministracaoTerceirosFornecedorFornecedorConsultarComponent },
{ path: 'centro-de-custo-consultar', component: AdministracaoCentroDeCustoCentroDeCustoConsultarComponent },
{ path: 'centro-de-custo-adicionar', component: AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent },
{ path: 'centro-de-custo-adicionar/:id', component: AdministracaoCentroDeCustoCentroDeCustoAdicionarComponent },






];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
