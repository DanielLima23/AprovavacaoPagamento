import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-funcionario-consultar',
  templateUrl: './funcionario-consultar.component.html',
  styleUrls: ['./funcionario-consultar.component.scss']
})
export class PedidoFuncionarioConsultarComponent implements OnInit {

  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  pedidos : any = [];

  constructor(private router : Router) { }

  ngOnInit() {
  }

  adicionar() {
    this.router.navigate(['/pedido/funcionario']);
  }

}
