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

const routes: Routes = [{ path: 'lista', component: AdministracaoUsuariosListaComponent },
{ path: 'convidar', component: AdministracaoUsuariosConvidarComponent },
{ path: 'pendentes-aprovacao', component: AdministracaoUsuariosPendentesAprovacaoComponent },
{ path: 'aprovar', component: AdministracaoUsuariosAprovarComponent },
{ path: 'aprovar/:id', component: AdministracaoUsuariosAprovarComponent },
{ path: 'editar', component: AdministracaoUsuariosEditarComponent },
{ path: 'editar/:id', component: AdministracaoUsuariosEditarComponent },
{ path: 'ceo-aprovacao-pendente', component: AdministracaoCeoCeoAprovacaoPendenteComponent },
{ path: 'ceo-aprovar', component: AdministracaoCeoCeoAprovarComponent },
{ path: 'diretor-aprovacao-pendente', component: AdministracaoDiretorDiretorAprovacaoPendenteComponent },
{ path: 'diretor-aprovar', component: AdministracaoDiretorDiretorAprovarComponent },
{ path: 'financeiro-aprovacao-pendente', component: AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent },
{ path: 'financeiro-aprovar', component: AdministracaoFinanceiroFinanceiroAprovarComponent },
{ path: 'responsavel-aprovacao-pendente', component: AdministracaoResponsavelCentroResponsavelAprovacaoPendenteComponent },
{ path: 'responsavel-aprovar', component: AdministracaoResponsavelCentroResponsavelAprovarComponent },
{ path: 'responsavel-aprovar/:id', component: AdministracaoResponsavelCentroResponsavelAprovarComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoRoutingModule { }
