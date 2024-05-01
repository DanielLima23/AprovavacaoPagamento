import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService, Token, TokenService } from '@core/authentication';
import { ToastrService } from 'ngx-toastr';
import { DialogTrocaSenhaPrimeiroAcessoComponent } from 'app/routes/dialog/troca-senha-primeiro-acesso/troca-senha-primeiro-acesso.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogTermosSegurancaComponent } from 'app/routes/dialog/termos-seguranca/termos-seguranca.component';
import { Usuario } from 'app/models/usuario';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { Observable, of } from 'rxjs';
import { TipoUsuarioSelect } from 'app/util/classes/select-tipo-usuario';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  listaTipoUsuario: any

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
    private tokenService: TokenService,
    private centroCustoService: CentroDeCustoService
  ) { }

  ngOnInit(): void {

    if (this.tokenService.valid() && this.router.url.includes('/')) {
      this.router.navigateByUrl('/dashboard');
    }
    this.listaTipoUsuario = [0,1,3,4]


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
          this.getRolesResponsavel()
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

  get tokenUsuario(): string {
    return this.tokenService.getToken()
  }

  get tokenCliente(): string {
    return this.tokenService.getTokenCliente()
  }

  get rolesUser(): string {
    return this.tokenService.getRoles()
  }

  private token: any;

  setRolesResponsavel(roleResponsavel: any): Observable<Token> {
    this.token = { access_token: this.tokenUsuario, token_type: 'bearer', access_token_cliente: this.tokenCliente, roles: [this.rolesUser[0], roleResponsavel] } as Token;
    this.tokenService.set(this.token)
    this.auth.check()
    return of(this.token);
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

  getRolesResponsavel(): any {
    this.centroCustoService.getListCentroDeCustoPorResponsavel().subscribe(
      (data: any) => {
        if ((data != null || data != undefined) && data.length > 0) {
          this.usuarioService.getUsuarioClienteById(data[0].reponsavel.id).subscribe(
            (data: any) => {
              if(!this.listaTipoUsuario.includes(data.tipo)){
                this.setRolesResponsavel(6)
              }
            }
          )

        }
        else {
          this.setRolesResponsavel(7)
        }
      }
    )
  }

  trocarSenha(pNovaSenha: string) {
    this.usuarioService.atualizarSenha(pNovaSenha).subscribe(
      (data: any) => {
        this.toastr.success('Senha alterada com sucesso.', 'Sucesso')
      }
    )
  }
}
