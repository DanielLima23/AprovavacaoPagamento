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

const COMPONENTS: any[] = [DialogEditParcelaDialogComponent, DialogEditRateioDialogComponent, DialogEditCentroCustoDialogComponent, DialogEditFornecedorDialogComponent, DialogEditContaUsuarioDialogComponent, DialogEditContaTerceiroDialogComponent, DialogEditUsuarioRegisterContaComponent, DialogLogoutComponent, DialogConfirmarExclusaoComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [
    SharedModule,
    DialogRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ]
})
export class DialogModule { }
