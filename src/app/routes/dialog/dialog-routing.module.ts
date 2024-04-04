import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogEditParcelaDialogComponent } from './edit-parcela-dialog/edit-parcela-dialog.component';
import { DialogEditRateioDialogComponent } from './edit-rateio-dialog/edit-rateio-dialog.component';
import { DialogEditCentroCustoDialogComponent } from './edit-centro-custo-dialog/edit-centro-custo-dialog.component';
import { DialogEditFornecedorDialogComponent } from './edit-fornecedor-dialog/edit-fornecedor-dialog.component';
import { DialogEditContaUsuarioDialogComponent } from './edit-conta-usuario-dialog/edit-conta-usuario-dialog.component';
import { DialogEditContaTerceiroDialogComponent } from './edit-conta-terceiro-dialog/edit-conta-terceiro-dialog.component';
import { DialogEditUsuarioRegisterContaComponent } from './edit-usuario-register-conta/edit-usuario-register-conta.component';

const routes: Routes = [{ path: 'edit-parcela-dialog', component: DialogEditParcelaDialogComponent },
{ path: 'edit-rateio-dialog', component: DialogEditRateioDialogComponent },
{ path: 'edit-centro-custo-dialog', component: DialogEditCentroCustoDialogComponent },
{ path: 'edit-fornecedor-dialog', component: DialogEditFornecedorDialogComponent },
{ path: 'edit-conta-usuario-dialog', component: DialogEditContaUsuarioDialogComponent },
{ path: 'edit-conta-terceiro-dialog', component: DialogEditContaTerceiroDialogComponent },
{ path: 'edit-usuario-register-conta', component: DialogEditUsuarioRegisterContaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DialogRoutingModule { }