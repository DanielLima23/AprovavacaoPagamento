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
import { forkJoin } from 'rxjs';


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
      usuario.nomeCentroDeCusto = this.retornaCentroDeCustoPorId(usuario).descricao;
      usuario.reponsavelAprovacao = this.retornaCentroDeCustoPorId(usuario).reponsavelAprovacao
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

  // formatarPalavraCentroGerencia(usuario: Usuario): boolean {
  //   const centro = this.listaCentroDeCusto.find(centro => centro.id === usuario.idCentroCusto);
  //   if (centro) {
  //     return centro.responsavelAprovacao;
  //   }
  //   return false;
  // }

}


// removerAcentos(texto: string): string {
//   if (texto) {
//     return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
//   }
//   return '';
// }

// formatarPalavra(palavra: string): string {
//   let palavraFormatada = "";
//   if (palavra) {
//     palavraFormatada = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
//     return palavraFormatada.toLowerCase()
//   } else {
//     return ""
//   }

// }


