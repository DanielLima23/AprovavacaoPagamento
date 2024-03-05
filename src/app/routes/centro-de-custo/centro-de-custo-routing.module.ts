import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentroDeCustoConsultarComponent } from './consultar/consultar.component';
import { CentroDeCustoAdicionarComponent } from './adicionar/adicionar.component';

const routes: Routes = [
  { path: 'consultar', component: CentroDeCustoConsultarComponent },
  { path: 'adicionar', component: CentroDeCustoAdicionarComponent },
  { path: 'adicionar/:id', component: CentroDeCustoAdicionarComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentroDeCustoRoutingModule {}
