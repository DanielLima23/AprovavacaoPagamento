import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { Usuario } from 'app/models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private url = Data.url

  constructor(private http: HttpClient,
    private tokenService: TokenService) {

  }

  getByToken(): Observable<any> {
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/usuario/get/token`;

    return this.http.get(path, { headers });
  }

  getById(id: any): Observable<any> {
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/usuario/get/id/${id}`;

    return this.http.get(path, { headers });
  }

  update(usuario: any): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/usuario/${usuario.id}`;

    return this.http.put(path, usuario, { headers })
  }

  getListFuncionario() : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/usuario/all', { headers })
  }

  getListaUsuarios() : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/usuario/RetornaUsuariosAprovadosEBloqueados', { headers })
  }

  getListaUsuariosPendentes() : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/usuario/RetornaUsuariosAguardandoAprovacao', { headers })
  }

  aprovarUsuario(value: any,): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/usuario/aprovacaoUsuario/`;

    return this.http.post(path, value, { headers })
  }

  getUsuarioClienteById(id: any): Observable<any> {
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ?? '',
      tokenCliente: pTokenCliente ?? '',
      idusuario: id,
    });

    const path = `${this.url}api/usuario/retornaUsuarioCliente/`;

    return this.http.get(path, { headers });
  }

  deleteUsuarioById(id: any): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      id: id
    });

    const path = `${this.url}api/usuario/delete`;

    return this.http.delete(path, { headers })
  }


}
