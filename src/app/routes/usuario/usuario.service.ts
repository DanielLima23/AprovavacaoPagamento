import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  update(usuario: Usuario): Observable<any> {
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

}
