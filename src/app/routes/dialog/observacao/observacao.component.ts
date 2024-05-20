import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-observacao',
  templateUrl: './observacao.component.html',
  styleUrls: ['./observacao.component.scss']
})
export class DialogObservacaoComponent implements OnInit {

  mensagemConfirmacao: string= ""
  observacao:any
  constructor(public dialogRef: MatDialogRef<DialogObservacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.mensagemConfirmacao = data.mensagemConfirmacao
  }


  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.observacao);
  }

  delete() {
    this.dialogRef.close();
  }
}
