import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmar-exclusao',
  templateUrl: './confirmar-exclusao.component.html',
  styleUrls: ['./confirmar-exclusao.component.scss']
})
export class DialogConfirmarExclusaoComponent implements OnInit {
  mensagemConfirmacao: string= ""

  constructor(public dialogRef: MatDialogRef<DialogConfirmarExclusaoComponent>,
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
    this.dialogRef.close(true);
  }

  delete() {
    this.dialogRef.close(false);
  }

}
