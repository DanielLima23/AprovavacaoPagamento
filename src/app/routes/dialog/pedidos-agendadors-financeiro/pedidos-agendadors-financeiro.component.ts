import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PedidoService } from 'app/routes/pedido/pedido.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-pedidos-agendadors-financeiro',
  templateUrl: './pedidos-agendadors-financeiro.component.html',
  styleUrls: ['./pedidos-agendadors-financeiro.component.scss']
})
export class DialogPedidosAgendadorsFinanceiroComponent implements OnInit {

  displayedColumns: string[] = ['descricao', 'responsavel', 'actions'];
  parcelas: any = [];
  date: any
  constructor(private router: Router,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private pedidoService: PedidoService,
    public dialogRef: MatDialogRef<DialogPedidosAgendadorsFinanceiroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.date = data
  }

  ngOnInit() {
    this.preencheListaPedidos()
  }

  adicionar() {
    this.router.navigate(['/pedido/adicionar']);
  }

  aprovarParcela(id: number) {
    // this.pedidoService.pagarParcela(id).subscribe(data => {
    //   this.toastr.success('Parcela paga', 'Sucesso')
    //   this.preencheListaPedidos()
    // })
    //this.dialogRef.close()
  }

  preencheListaPedidos() {
    // this.pedidoService.getListParcelasPendentesPorData(this.date.date).subscribe(data => {
    //   this.parcelas = data.filter((parcela: any) => parcela.statusPagamento == 0)
    // })
  }

}
