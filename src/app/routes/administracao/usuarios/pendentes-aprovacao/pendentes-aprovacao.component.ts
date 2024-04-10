import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/models/usuario';
import { UsuarioService } from 'app/routes/usuario/usuario.service';

@Component({
  selector: 'app-administracao-usuarios-pendentes-aprovacao',
  templateUrl: './pendentes-aprovacao.component.html',
  styleUrls: ['./pendentes-aprovacao.component.scss']
})
export class AdministracaoUsuariosPendentesAprovacaoComponent implements OnInit {
recusarUsuario(arg0: number) {
throw new Error('Method not implemented.');
}
aprovarUsuario(arg0: number) {
throw new Error('Method not implemented.');
}

  listaUsuariosPendentes: Usuario[]=[]
  constructor(private usuarioService: UsuarioService) { }

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

}
