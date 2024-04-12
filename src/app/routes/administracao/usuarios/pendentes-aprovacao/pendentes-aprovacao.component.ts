import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usuario } from 'app/models/usuario';
import { DialogConfirmarExclusaoComponent } from 'app/routes/dialog/confirmar-exclusao/confirmar-exclusao.component';
import { DialogEditCentroCustoDialogComponent } from 'app/routes/dialog/edit-centro-custo-dialog/edit-centro-custo-dialog.component';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-administracao-usuarios-pendentes-aprovacao',
  templateUrl: './pendentes-aprovacao.component.html',
  styleUrls: ['./pendentes-aprovacao.component.scss']
})
export class AdministracaoUsuariosPendentesAprovacaoComponent implements OnInit {


  listaUsuariosPendentes: Usuario[] = []
  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.preencherListaUsuariosPendentes()
  }

  preencherListaUsuariosPendentes() {
    this.usuarioService.getListaUsuariosPendentes().subscribe(
      (data: any) => {
        this.listaUsuariosPendentes = data;
      }
    )
  }

  recusarUsuario(id: number) {
    this.usuarioService.deleteUsuarioById(id).subscribe(
      (data: any) => {
        this.toastr.success('Usuario recusado com sucesso!','Sucesso');
        this.preencherListaUsuariosPendentes()
      }
    )

  }
  aprovarUsuario(id: number) {
    this.router.navigate(['/administracao/aprovar', id]);
  }
  mensagemConfirmacao: string = "Deseja excluir essa solicitação de cadastro?"
  openDialogDelete(id: any): void {
    const dialogRef = this.dialog.open(DialogConfirmarExclusaoComponent,{
      data: {mensagemConfirmacao: this.mensagemConfirmacao}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recusarUsuario(id);
      }
    });
  }

}
