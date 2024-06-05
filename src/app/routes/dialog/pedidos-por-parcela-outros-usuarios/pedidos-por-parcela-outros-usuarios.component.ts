import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pedidos-por-parcela-outrosUsuarios',
  templateUrl: './pedidos-por-parcela-outros-usuarios.component.html',
  styleUrls: ['./pedidos-por-parcela-outros-usuarios.component.scss']
})
export class DialogPedidosPorParcelaOutrosUsuariosComponent implements OnInit {

  idPedido: any
  constructor(public dialogRef: MatDialogRef<DialogPedidosPorParcelaOutrosUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPedido = data
  }
  ngOnInit() {
  }

}
