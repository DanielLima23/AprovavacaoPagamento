import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FornecedorAdicionarComponent } from './adicionar/adicionar.component';
import { FornecedorConsultarComponent } from './consultar/consultar.component';
import { FornecedorContaComponent } from './conta/conta.component';

const routes: Routes = [{ path: 'adicionar', component: FornecedorAdicionarComponent },
{ path: 'adicionar/:id', component: FornecedorAdicionarComponent },
{ path: 'consultar', component: FornecedorConsultarComponent },
{ path: 'conta', component: FornecedorContaComponent },
{ path: 'conta/:id', component: FornecedorContaComponent },
{ path: 'conta/:id/:idConta', component: FornecedorContaComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorRoutingModule { }
