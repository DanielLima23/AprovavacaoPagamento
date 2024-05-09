import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pedidos-por-parcela-funcionario',
  templateUrl: './pedidos-por-parcela-funcionario.component.html',
  styleUrls: ['./pedidos-por-parcela-funcionario.component.scss']
})
export class DialogPedidosPorParcelaFuncionarioComponent implements OnInit {

  idPedido: any
  constructor(public dialogRef: MatDialogRef<DialogPedidosPorParcelaFuncionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idPedido = data
  }
  ngOnInit(): void {

  }

}
