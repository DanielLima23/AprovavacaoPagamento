import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-fornecedor-consultar',
  templateUrl: './fornecedor-consultar.component.html',
  styleUrls: ['./fornecedor-consultar.component.scss']
})
export class PedidoFornecedorConsultarComponent implements OnInit {


  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  pedidos : any = [];

  constructor(private router : Router) { }

  ngOnInit() {
  }

  adicionar() {
    this.router.navigate(['/pedido/fornecedor']);
  }

}
