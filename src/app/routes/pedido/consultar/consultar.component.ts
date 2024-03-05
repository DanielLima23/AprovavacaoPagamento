import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class PedidoConsultarComponent implements OnInit {

  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  pedidos : any = [];

  constructor(private router : Router) { }

  ngOnInit() {
  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

}
