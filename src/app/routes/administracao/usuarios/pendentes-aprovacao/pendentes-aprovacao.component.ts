import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'app/models/usuario';
import { UsuarioService } from 'app/routes/usuario/usuario.service';

@Component({
  selector: 'app-administracao-usuarios-pendentes-aprovacao',
  templateUrl: './pendentes-aprovacao.component.html',
  styleUrls: ['./pendentes-aprovacao.component.scss']
})
export class AdministracaoUsuariosPendentesAprovacaoComponent implements OnInit {


  listaUsuariosPendentes: Usuario[] = []
  constructor(private usuarioService: UsuarioService,
    private router: Router
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
  }
  aprovarUsuario(id: number) {
    this.router.navigate(['/administracao/aprovar', id]);
  }

}
