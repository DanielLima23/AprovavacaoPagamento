import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContaUsuario } from 'app/models/conta-usuario';

@Component({
  selector: 'app-dialog-edit-conta-usuario-dialog',
  templateUrl: './edit-conta-usuario-dialog.component.html',
  styleUrls: ['./edit-conta-usuario-dialog.component.scss']
})
export class DialogEditContaUsuarioDialogComponent implements OnInit {

  contaUsuario: ContaUsuario = new ContaUsuario()


  constructor(public dialogRef: MatDialogRef<DialogEditContaUsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.contaUsuario = { ...data };
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  salvar() {
    this.dialogRef.close(this.contaUsuario);
  }

  delete() {
    this.dialogRef.close(this.contaUsuario.id);
  }

}
