import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TokenService } from '@core';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { Usuario } from 'app/models/usuario';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';
import { UsuarioService } from 'app/routes/usuario/usuario.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-administracao-usuarios-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class AdministracaoUsuariosListaComponent implements OnInit {

  listaUsuarios: Usuario[] = []
  displayedColumns: string[] = ['usuario', 'centroDeCusto', 'actions'];
  listaCentroDeCusto: CentroDeCusto[] = []

  userForm: FormGroup;
  urlRegister: string = "auth/register/" + this.tokenService.getTokenCliente();
  textoParaCopiar: string = '';

  enderecoBase!: string;

  ngOnInit() {
    this.carregarDados()
    this.userForm = this.formBuilder.group({ // Crie um FormGroup aqui
      linkRegister: ['']
    });
    this.enderecoBase = `${window.location.protocol}//${window.location.host}/`;

    this.userForm.get('linkRegister')?.disable();
    this.textoParaCopiar = this.enderecoBase + this.urlRegister;
    this.userForm.get('linkRegister')?.setValue(this.textoParaCopiar)
  }

  carregarDados() {
    forkJoin([
      this.usuarioService.getListaUsuarios(),
      this.centroCustoService.getListaCentroDeCusto()
    ]).subscribe(([usuarios, centrosDeCusto]) => {
      this.listaUsuarios = usuarios;
      this.filteredListaUsuarios = usuarios
      this.listaCentroDeCusto = centrosDeCusto;
      this.populaNomeCentroNoUsuario();
    });
  }

  constructor(private _snackBar: MatSnackBar,
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private centroCustoService: CentroDeCustoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      linkRegister: ['']
    })
  }

  copiarTexto() {
    this.textoParaCopiar = this.userForm.get('linkRegister')?.value;
    navigator.clipboard.writeText(this.textoParaCopiar).then(() => {
      this._snackBar.open('Texto copiado para a área de transferência', 'Fechar', {
        duration: 2000,
      });
    }, (err) => {
      console.error('Erro ao copiar texto: ', err);
      this._snackBar.open('Erro ao copiar texto', 'Fechar', {
        duration: 2000,
      });
    });
  }


  populaNomeCentroNoUsuario() {
    const centrosDeCustoMap = new Map<number, CentroDeCusto>();

    // Mapear os centros de custo por ID para evitar repetidas chamadas desnecessárias
    this.listaCentroDeCusto.forEach(centro => {
      centrosDeCustoMap.set(centro.id, centro);
    });

    // Iterar sobre a lista de usuários filtrados e mapear os nomes dos centros de custo
    this.filteredListaUsuarios.forEach(usuario => {
      const centroDeCusto = centrosDeCustoMap.get(usuario.idCentroCusto);
      if (centroDeCusto) {
        usuario.nomeCentroDeCusto = centroDeCusto.descricao || "Não contém";
        usuario.reponsavelAprovacao = centroDeCusto.reponsavelAprovacao || false;
      } else {
        usuario.nomeCentroDeCusto = "Não contém";
        usuario.reponsavelAprovacao = false;
      }
    });

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
  filteredListaUsuarios: Usuario[] = []

  _filter: string = ""

  set filter(value: string) {
    this._filter = value;
    this.filteredListaUsuarios = this.listaUsuarios.filter((usuario: Usuario) => usuario.nome.toLocaleLowerCase().indexOf(this._filter.toLocaleLowerCase()) > -1)
  }

  get filter(): string {
    return this._filter
  }


  openDialogDelete(arg0: any) {
  }
  editarUsuario(id: any) {
    this.router.navigate(['/administracao/editar', id]);
  }


}
