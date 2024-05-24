import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pedidos-por-parcela-fornecedor',
  templateUrl: './pedidos-por-parcela-fornecedor.component.html',
  styleUrls: ['./pedidos-por-parcela-fornecedor.component.scss']
})
export class DialogPedidosPorParcelaFornecedorComponent implements OnInit {

  idPedido: any
  constructor(public dialogRef: MatDialogRef<DialogPedidosPorParcelaFornecedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPedido = data
  }
  ngOnInit() {
  }

}
