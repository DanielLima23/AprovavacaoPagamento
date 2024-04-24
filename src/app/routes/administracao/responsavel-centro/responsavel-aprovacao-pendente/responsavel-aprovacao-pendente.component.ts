import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from 'app/routes/pedido/pedido.service';

@Component({
  selector: 'app-administracao-responsavel-centro-responsavel-aprovacao-pendente',
  templateUrl: './responsavel-aprovacao-pendente.component.html',
  styleUrls: ['./responsavel-aprovacao-pendente.component.scss']
})
export class AdministracaoResponsavelCentroResponsavelAprovacaoPendenteComponent implements OnInit {


  pedidos: any = [];

  constructor(private pedidoService: PedidoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.preencheListaStatusPedidos()
  }
  preencheListaStatusPedidos() {
    this.pedidoService.getListStatusPedido().subscribe(
      (lista: any[]) => {
        this.pedidos = lista;
      })
  }
  verDetalhesPedido(id: any) {
    this.router.navigate(['/administracao/responsavel-aprovar', id]);
  }

}
