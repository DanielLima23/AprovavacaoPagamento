import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CentroDeCusto } from 'app/models/centro-de-custo';

@Component({
  selector: 'app-dialog-edit-centro-custo-dialog',
  templateUrl: './edit-centro-custo-dialog.component.html',
  styleUrls: ['./edit-centro-custo-dialog.component.scss']
})
export class DialogEditCentroCustoDialogComponent implements OnInit {

  centro: CentroDeCusto = new CentroDeCusto()


  constructor(public dialogRef: MatDialogRef<DialogEditCentroCustoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.centro = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.centro);
  }

  delete() {
    this.dialogRef.close(this.centro.id);
  }

}
