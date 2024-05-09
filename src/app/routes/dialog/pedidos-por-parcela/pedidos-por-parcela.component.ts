import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pedidos-por-parcela',
  templateUrl: './pedidos-por-parcela.component.html',
  styleUrls: ['./pedidos-por-parcela.component.scss']
})
export class DialogPedidosPorParcelaComponent implements OnInit {

  idPedido: any
  constructor(public dialogRef: MatDialogRef<DialogPedidosPorParcelaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPedido = data
  }

  ngOnInit() {
  }

}
