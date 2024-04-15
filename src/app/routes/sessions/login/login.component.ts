import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService, TokenService } from '@core/authentication';
import { ToastrService } from 'ngx-toastr';
import { DialogTrocaSenhaPrimeiroAcessoComponent } from 'app/routes/dialog/troca-senha-primeiro-acesso/troca-senha-primeiro-acesso.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogTermosSegurancaComponent } from 'app/routes/dialog/termos-seguranca/termos-seguranca.component';
import { Usuario } from 'app/models/usuario';
import { UsuarioService } from 'app/routes/usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {

    if(this.tokenService.valid() &&this.router.url.includes('/') ){
      this.router.navigateByUrl('/dashboard');
    }
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    this.isSubmitting = true;

    this.auth
      .login(this.username.value, this.password.value, this.rememberMe.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
          if (this.password.value == "admin") {
            this.openDialogTermosSeguranca()
          }
        },
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          if (errorRes.status === 500) {
            this.toastr.error('Erro interno do servidor.', 'Erro')
          }
          this.isSubmitting = false;
        },
      });
  }


  openDialogTermosSeguranca(): void {
    const dialogRef = this.dialog.open(DialogTermosSegurancaComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openDialogTrocaSenha()
      } else {
        return;
      }
    });
  }

  openDialogTrocaSenha(): void {
    const dialogRef = this.dialog.open(DialogTrocaSenhaPrimeiroAcessoComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trocarSenha(result)
      } else {
        return;
      }
    });
  }

  trocarSenha(pNovaSenha: string) {
    this.usuarioService.atualizarSenha(pNovaSenha).subscribe(
      (data: any) => {
        this.toastr.success('Senha alterada com sucesso.', 'Sucesso')
      }
    )
  }
}
