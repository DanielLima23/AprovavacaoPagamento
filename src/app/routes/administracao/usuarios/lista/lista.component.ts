import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '@core';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/centro-de-custo/centro-de-custo.service';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-administracao-usuarios-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class AdministracaoUsuariosListaComponent implements OnInit {

  openDialogDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  editarUsuario(arg0: any) {
    throw new Error('Method not implemented.');
  }

  listaUsuarios: Usuario[] = []
  displayedColumns: string[] = ['usuario', 'centroDeCusto', 'actions'];
  listaCentroDeCusto: CentroDeCusto[] = []

  ngOnInit() {
    this.carregarDados()
  }

  carregarDados() {
    forkJoin([
      this.usuarioService.getListaUsuarios(),
      this.centroCustoService.getListaCentroDeCusto()
    ]).subscribe(([usuarios, centrosDeCusto]) => {
      this.listaUsuarios = usuarios;
      this.listaCentroDeCusto = centrosDeCusto;
      this.populaNomeCentroNoUsuario();
    });
  }

  constructor(private _snackBar: MatSnackBar,
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private centroCustoService: CentroDeCustoService) {
  }


  populaNomeCentroNoUsuario() {
    this.listaUsuarios.map(usuario => {
      usuario.nomeCentroDeCusto = this.retornaCentroDeCustoPorId(usuario).descricao ? this.retornaCentroDeCustoPorId(usuario).descricao : "Não contém"
      usuario.reponsavelAprovacao = this.retornaCentroDeCustoPorId(usuario).reponsavelAprovacao ? this.retornaCentroDeCustoPorId(usuario).reponsavelAprovacao : false

    })
  }

  public preencherListaUsuarios() {
    this.usuarioService.getListaUsuarios().subscribe(
      (data: Usuario[]) => {
        this.listaUsuarios = data;
      }
    )
  }

  public retornaCentroDeCustoPorId(usuario: Usuario): any {
    return this.listaCentroDeCusto.find(x => x.id === usuario.idCentroCusto);
  }

  public retornaListaCentroDeCusto() {
    this.centroCustoService.getListaCentroDeCusto().subscribe(
      (data: CentroDeCusto[]) => {
        this.listaCentroDeCusto = data;
      }
    )
  }

}
