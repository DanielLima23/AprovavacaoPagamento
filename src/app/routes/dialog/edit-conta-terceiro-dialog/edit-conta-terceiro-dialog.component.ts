import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContaTerceiro } from 'app/models/conta-terceiro';

@Component({
  selector: 'app-dialog-edit-conta-terceiro-dialog',
  templateUrl: './edit-conta-terceiro-dialog.component.html',
  styleUrls: ['./edit-conta-terceiro-dialog.component.scss']
})
export class DialogEditContaTerceiroDialogComponent implements OnInit {

  contaTerceiro: ContaTerceiro = new ContaTerceiro()

  constructor(public dialogRef: MatDialogRef<DialogEditContaTerceiroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.contaTerceiro = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.contaTerceiro);
  }

  delete() {
    this.dialogRef.close(this.contaTerceiro.id);
  }

}
