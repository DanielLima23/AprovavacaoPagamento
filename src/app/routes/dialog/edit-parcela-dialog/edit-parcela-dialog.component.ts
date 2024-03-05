import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Parcelas } from 'app/models/parcelas';

@Component({
  selector: 'app-dialog-edit-parcela-dialog',
  templateUrl: './edit-parcela-dialog.component.html',
  styleUrls: ['./edit-parcela-dialog.component.scss']
})
export class DialogEditParcelaDialogComponent implements OnInit {

  parcela: Parcelas = new Parcelas()


  constructor(public dialogRef: MatDialogRef<DialogEditParcelaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.parcela = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.parcela);
  }

  delete() {
    this.dialogRef.close(this.parcela.id);
  }
}
