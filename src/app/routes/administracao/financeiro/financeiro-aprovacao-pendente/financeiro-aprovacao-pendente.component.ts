import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RequestAprovaPedido } from 'app/models/auxiliar/request-aprova-pedido';
import { DialogConfirmacaoComponent } from 'app/routes/dialog/confirmacao/confirmacao.component';
import { DialogLogoutComponent } from 'app/routes/dialog/logout/logout.component';
import { DialogPedidosAgendadorsFinanceiroComponent } from 'app/routes/dialog/pedidos-agendadors-financeiro/pedidos-agendadors-financeiro.component';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

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
    public dialog: MatDialog,
    private toastr: ToastrService,
    private datePipe: DatePipe
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
    const dataFormatada = this.datePipe.transform(this.selectedDate, 'yyyy-MM-ddTHH:mm:ss');
    const dialogRef = this.dialog.open(DialogPedidosAgendadorsFinanceiroComponent, {
      data: { date: dataFormatada }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  mensagemConfirmacao: string = "Deseja aprovar esse pedido?"
  openDialogConfirmarAprovacao(pedido: any): void {
    const dialogRef = this.dialog.open(DialogConfirmacaoComponent, {
      data: { mensagemConfirmacao: this.mensagemConfirmacao }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aprovarPedido(pedido);
      }
    });
  }

  idCentroDeCusto: any
  aprovarPedido(pedido: any) {
    this.pedidoService.getPedidoById(pedido.pedidoId).subscribe(
      (data: any) => {
        this.idCentroDeCusto = data.formaPagamento[0].centroDeCusto.id
        const requestAprovaPedido = new RequestAprovaPedido(pedido, this.idCentroDeCusto, "")
        requestAprovaPedido.financeiro = 1;
        this.pedidoService.aprovarPedido(requestAprovaPedido).subscribe(
          (data: any) => {
            this.toastr.success("Pedido aprovado com sucesso!", 'Sucesso')
            this.preencheListaStatusPedidos()
          }
        )
      })
  }
}
