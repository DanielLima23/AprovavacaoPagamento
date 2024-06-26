import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RequestAprovaPedido } from 'app/models/auxiliar/request-aprova-pedido';
import { DialogConfirmacaoComponent } from 'app/routes/dialog/confirmacao/confirmacao.component';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administracao-diretor-diretor-aprovacao-pendente',
  templateUrl: './diretor-aprovacao-pendente.component.html',
  styleUrls: ['./diretor-aprovacao-pendente.component.scss']
})
export class AdministracaoDiretorDiretorAprovacaoPendenteComponent implements OnInit {


  pedidos: any = [];
  selectedDate: any;

  constructor(private pedidoService: PedidoService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
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
    if(pedido.terceiro){
      this.router.navigate(['/administracao/diretor-aprovar-terceiro', pedido.pedidoId], { state: { pedido: pedido } });
    }else {
      this.router.navigate(['/administracao/diretor-aprovar', pedido.pedidoId], { state: { pedido: pedido } });
    }
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
        // requestAprovaPedido.diretor = 1;
        if (pedido.responsavel == 0) {
          requestAprovaPedido.responsavel = 1
        } else if (pedido.diretor == 0) {
          requestAprovaPedido.diretor = 1
        }
        this.pedidoService.aprovarPedido(requestAprovaPedido).subscribe(
          (data: any) => {
            this.toastr.success("Pedido aprovado com sucesso!", 'Sucesso')
            this.preencheListaStatusPedidos()
          }
        )
      })
  }

}
