import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { Location } from '@angular/common';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/centro-de-custo/centro-de-custo.service';
import { CentroDeCusto } from 'app/models/centro-de-custo';


@Component({
  selector: 'app-administracao-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class AdministracaoUsuariosComponent implements OnInit {
  openDialogDelete(arg0: any) {
    throw new Error('Method not implemented.');
  }
  editarUsuario(arg0: any) {
    throw new Error('Method not implemented.');
  }

  listaUsuarios: Usuario[] = []
  displayedColumns: string[] = ['usuario', 'centroDeCusto', 'actions'];

  ngOnInit() {
    this.preencherListaUsuarios()
  }

  constructor(private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private centroCustoService: CentroDeCustoService) {
  }

  public preencherListaUsuarios() {
    this.usuarioService.getListaUsuarios().subscribe(
      (data: Usuario[]) => {
        this.listaUsuarios = data;
      }
    )
  }

  public retornaCentroDeCustoPorId(id: any) {
    this.centroCustoService.getById(id).subscribe(
      (data: CentroDeCusto) => {
        return data.descricao;
      }
    )
  }

}
