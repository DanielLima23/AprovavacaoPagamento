import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-troca-senha-primeiro-acesso',
  templateUrl: './troca-senha-primeiro-acesso.component.html',
  styleUrls: ['./troca-senha-primeiro-acesso.component.scss']
})
export class DialogTrocaSenhaPrimeiroAcessoComponent implements OnInit {

  senhaVisivel: string = 'password'
  confirmarSenhaVisivel: string = 'password';

  constructor(public dialogRef: MatDialogRef<DialogTrocaSenhaPrimeiroAcessoComponent>) { }

  ngOnInit() {
  }

  fechar() {
    this.dialogRef.close(false);
  }

  aceitar() {
    if (this.trocarSenhaForm.valid) {
      this.dialogRef.close(this.trocarSenhaForm.value.novaSenha);
    }
  }

  public trocarSenhaForm: UntypedFormGroup = new UntypedFormGroup({
    novaSenha: new UntypedFormControl(undefined),
    confirmaNovaSenha: new UntypedFormControl(undefined, Validators.required)
  });

  checkPasswords(formGroup: UntypedFormGroup) {
    const senha = formGroup.get('novaSenha')?.value;
    const confirmarSenha = formGroup.get('confirmaNovaSenha')?.value;

    if (senha === confirmarSenha && (senha !== '' && confirmarSenha !== '')) {
      formGroup.get('confirmaNovaSenha')?.setErrors(null);
    } else {
      formGroup.get('confirmaNovaSenha')?.setErrors({ notSame: true });
    }
  }

  togglePasswordVisibility() {
    this.senhaVisivel = this.senhaVisivel === 'password' ? 'text' : 'password';
  }
  toggleConfirmPasswordVisibility() {
    this.confirmarSenhaVisivel = this.confirmarSenhaVisivel === 'password' ? 'text' : 'password';
  }
}
