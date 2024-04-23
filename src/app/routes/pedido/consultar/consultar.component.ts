import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-pedido-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.scss']
})
export class PedidoConsultarComponent implements OnInit {


  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  pedidos: any = [];
  idPedido: number = 0

  constructor(private router: Router,
    private pedidoService: PedidoService
  ) { }

  ngOnInit() {
  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

  verPedido(id: number) {
    this.idPedido = id
    this.router.navigate(['/pedido/adicionar'], { state: { id: id } });

  }


}
