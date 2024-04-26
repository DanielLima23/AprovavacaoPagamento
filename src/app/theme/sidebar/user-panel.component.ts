import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/authentication';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { DialogLogoutComponent } from 'app/routes/dialog/logout/logout.component';
import { DialogTermosSegurancaComponent } from 'app/routes/dialog/termos-seguranca/termos-seguranca.component';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { SoundService } from 'app/services-outros/sound-service';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel">
      <img class="matero-user-panel-avatar" [src]="user.avatar" alt="avatar" width="64" />
      <h4 class="matero-user-panel-name">{{ user.name }}</h4>
      <h5 style="font-size: small;" class="matero-user-panel-email">{{ user.email }}</h5>
      <div class="matero-user-panel-icons">
        <!-- <button
          mat-icon-button
          routerLink="/profile/overview"
          matTooltip="{{ 'profile' | translate }}"
        >
          <mat-icon class="icon-18">account_circle</mat-icon>
        </button> -->
        <button
          mat-icon-button
          routerLink="/usuario/editar"
          matTooltip="{{ 'Editar perfil' | translate }}"
        >
          <mat-icon class="icon-18">edit</mat-icon>
        </button>
        <button mat-icon-button (click)="confirmarLogout()" matTooltip="{{ 'Sair' | translate }}">
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserPanelComponent implements OnInit {
  user!: User;
  listaUsuariosPendentes: Usuario[] = []
  constructor(
    private router: Router,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private soundService: SoundService,
    private http: HttpClient,
    private centroDeCustoService: CentroDeCustoService
  ) { }

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
    this.retornaUsuario()
    //this.preencherListaUsuariosPendentes()
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  preencherListaUsuariosPendentes() {
    this.usuarioService.getListaUsuariosPendentes().subscribe(
      (data: any) => {
        this.listaUsuariosPendentes = data;
        this.carregarMenu();
      }
    );
  }




  retornaUsuario() {
    this.usuarioService.getByToken().subscribe(
      (data: Usuario) => {
        this.user.name = data.nome;
        this.centroDeCustoService.getById(data.idCentroCusto).subscribe(
          (centro: any) => {
            this.user.email = centro.descricao;

          }
        )
      },
      (error: any) => {
      }
    )
  }
  menuData: any;
  carregarMenu() {
    this.http.get('assets/data/menu.json').subscribe((data: any) => {
      this.menuData = data;
      this.manipularMenu(this.menuData);
    });
  }

  manipularMenu(menu: any): void {
    if (menu.menu) {
      const administracaoItem = menu.menu.find((item: any) => item.name === 'Administracao');
      if (administracaoItem && administracaoItem.badge) {
        administracaoItem.badge.value = this.listaUsuariosPendentes.length;
      }
      if (administracaoItem && administracaoItem.children) {
        administracaoItem.children.forEach((child: any) => {
          if (child) {
            child.children[0].badge.value = this.listaUsuariosPendentes.length;
          }
        });
      }
    }
    this.menuData = menu;
    this.salvarJSON(this.menuData)

    console.log(this.menuData);
  }

  salvarJSON(data: any) {
    this.http.put('assets/data/menu.json', data).subscribe(response => {
      console.log('JSON atualizado com sucesso:', response);
    }, error => {
      console.error('Erro ao atualizar JSON:', error);
    });
  }


  confirmarLogout() {
    this.playSound()
    this.openDialogDelete()
  }

  openDialogDelete(): void {

    const dialogRef = this.dialog.open(DialogLogoutComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      } else {
        return;
      }
    });
  }

  playSound() {
    const soundPath = 'assets/sound/somLogout.mp3';
    this.soundService.playAudio(soundPath);
  }


}
