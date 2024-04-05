import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/authentication';
import { Usuario } from 'app/models/usuario';
import { DialogLogoutComponent } from 'app/routes/dialog/logout/logout.component';
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

  constructor(
    private router: Router,
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
    this.retornaUsuario()
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  retornaUsuario(){
    this.usuarioService.getByToken().subscribe(
      (data : Usuario) => {
        this.user.name = data.nome;
        this.user.email = data.email;
      },
      (error: any) => {
      }
    )
  }
  confirmarLogout(){
    this.playSound()
    this.openDialogDelete()
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DialogLogoutComponent, {
      width: '15%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }else{
        return;
      }
    });
  }

  playSound() {
    const soundPath = 'assets/sound/somLogout.mp3'; // Caminho para o arquivo de som
    this.soundService.playAudio(soundPath);
  }


}
