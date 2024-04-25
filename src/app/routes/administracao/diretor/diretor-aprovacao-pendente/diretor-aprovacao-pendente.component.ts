import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogConfirmacaoComponent } from 'app/routes/dialog/confirmacao/confirmacao.component';
import { PedidoService } from 'app/routes/pedido/pedido.service';

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
    this.router.navigate(['/administracao/diretor-aprovar',pedido.pedidoId], { state: { pedido: pedido }});
    //this.router.navigate(['/administracao/financeiro-aprovar'], { state: { pedido: pedido } });
  }

  mensagemConfirmacao: string = "Deseja aprovar esse pedido?"
  openDialogConfirmarAprovacao(id: any): void {
    const dialogRef = this.dialog.open(DialogConfirmacaoComponent,{
      data: {mensagemConfirmacao: this.mensagemConfirmacao}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.recusarUsuario(id);
      }
    });
  }

}
