import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerceiroConsultarComponent } from './consultar/consultar.component';
import { TerceiroAdicionarComponent } from './adicionar/adicionar.component';

const routes: Routes = [{ path: 'consultar', component: TerceiroConsultarComponent },
{ path: 'adicionar', component: TerceiroAdicionarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerceiroRoutingModule { }
