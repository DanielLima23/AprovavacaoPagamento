import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-termos-seguranca',
  templateUrl: './termos-seguranca.component.html',
  styleUrls: ['./termos-seguranca.component.scss']
})
export class DialogTermosSegurancaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogTermosSegurancaComponent>) { }

  ngOnInit() {
  }

  fechar() {
    this.dialogRef.close(false);
  }
  aceitar() {
    this.dialogRef.close(true);
  }

}
