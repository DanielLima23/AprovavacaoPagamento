import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogLogoutComponent } from 'app/routes/dialog/logout/logout.component';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import * as moment from 'moment';

@Component({
  selector: 'app-administracao-ceo-ceo-aprovacao-pendente',
  templateUrl: './ceo-aprovacao-pendente.component.html',
  styleUrls: ['./ceo-aprovacao-pendente.component.scss']
})
export class AdministracaoCeoCeoAprovacaoPendenteComponent implements OnInit {


  pedidos: any = [];
  selectedDate: any;

  constructor(private pedidoService: PedidoService,
    private router: Router,
    public dialog: MatDialog
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
  verDetalhesPedido(pedido: any) {
    this.router.navigate(['/administracao/ceo-aprovar',pedido.pedidoId], { state: { pedido: pedido }});

    //this.router.navigate(['/administracao/financeiro-aprovar'], { state: { pedido: pedido } });

  }




}
