import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsService } from '@core';
import { AuthService, User } from '@core/authentication';
import { DialogLogoutComponent } from 'app/routes/dialog/logout/logout.component';
import { SoundService } from 'app/services-outros/sound-service';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  template: `
    <button class="r-full" mat-button [matMenuTriggerFor]="menu">
      <img matButtonIcon class="avatar r-full" [src]="user.avatar" width="24" alt="avatar" />
      <span class="m-x-8">{{ user.name }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <!-- <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ 'profile' | translate }}</span>
      </button> -->
      <button routerLink="/usuario/editar" mat-menu-item>
        <mat-icon>edit</mat-icon>
        <span>{{ 'Editar perfil' | translate }}</span>
      </button>
      <!-- <button mat-menu-item (click)="restore()">
        <mat-icon>restore</mat-icon>
        <span>{{ 'restore_defaults' | translate }}</span>
      </button> -->
      <button mat-menu-item (click)="confirmarLogout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'Sair' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .avatar {
        width: 24px;
        height: 24px;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  user!: User;

  constructor(
    private router: Router,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private settings: SettingsService,
    private dialog: MatDialog,
    private soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => (this.user = user)),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
  }


  confirmarLogout(){
    this.playSound()
    this.openDialogDelete()
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DialogLogoutComponent);

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

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}
