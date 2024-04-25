import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacao',
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})
export class DialogConfirmacaoComponent implements OnInit {

  mensagemConfirmacao: string= ""

  constructor(public dialogRef: MatDialogRef<DialogConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.mensagemConfirmacao = data.mensagemConfirmacao
  }


  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  salvar() {
    this.dialogRef.close(true);
  }

  delete() {
    this.dialogRef.close(false);
  }

}
