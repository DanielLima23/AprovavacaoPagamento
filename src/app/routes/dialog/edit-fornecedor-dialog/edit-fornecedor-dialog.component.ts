import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Terceiro } from 'app/models/terceiro';

@Component({
  selector: 'app-dialog-edit-fornecedor-dialog',
  templateUrl: './edit-fornecedor-dialog.component.html',
  styleUrls: ['./edit-fornecedor-dialog.component.scss']
})
export class DialogEditFornecedorDialogComponent implements OnInit {

  terceiro: Terceiro = new Terceiro()


  constructor(public dialogRef: MatDialogRef<DialogEditFornecedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.terceiro = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.terceiro);
  }

  delete() {
    this.dialogRef.close(this.terceiro.id);
  }

}
