import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Parcelas } from 'app/models/parcelas';
import { Rateio } from 'app/models/rateio';

@Component({
  selector: 'app-dialog-edit-rateio-dialog',
  templateUrl: './edit-rateio-dialog.component.html',
  styleUrls: ['./edit-rateio-dialog.component.scss']
})
export class DialogEditRateioDialogComponent implements OnInit {

  rateio: Rateio = new Rateio()


  constructor(public dialogRef: MatDialogRef<DialogEditRateioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rateio) {
    this.rateio = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.rateio);
  }

  delete() {
    this.dialogRef.close(this.rateio.id);
  }
}
