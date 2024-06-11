import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
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

  atualizarAusencia(ausencia: any): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      ausente: ausencia.toString()
    });

    const path = `${this.url}api/usuario/AtualizarAusencia/`;

    return this.http.get(path, { headers })
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

  atualizarSenha(pSenha: string): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      senha: pSenha
    });
    const path = `${this.url}api/usuario/atualizarSenha`;

    return this.http.get(path, { headers })
  }


}
