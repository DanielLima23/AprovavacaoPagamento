import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogLogoutComponent } from 'app/routes/dialog/logout/logout.component';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import * as moment from 'moment';

@Component({
  selector: 'app-administracao-financeiro-financeiro-aprovacao-pendente',
  templateUrl: './financeiro-aprovacao-pendente.component.html',
  styleUrls: ['./financeiro-aprovacao-pendente.component.scss']
})
export class AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent implements OnInit {

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
    this.router.navigate(['/administracao/financeiro-aprovar', pedido.pedidoId], { state: { pedido: pedido } });

    // this.router.navigate(['/administracao/financeiro-aprovar', pedido.id]);
  }

  dateSelected(event: any) {
    this.selectedDate = event;
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogLogoutComponent, {
      width: '400px',
      data: { date: moment(this.selectedDate).format('LL') }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
