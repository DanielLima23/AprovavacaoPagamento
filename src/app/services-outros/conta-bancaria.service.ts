import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenService } from "@core";
import { Data } from "app/data/data";
import { Conta } from "app/models/conta";
import { ContaTerceiro } from "app/models/conta-terceiro";
import { ContaUsuario } from "app/models/conta-usuario";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContaBancariaService {

  private url = Data.url

  constructor(private http: HttpClient,
    private tokenService: TokenService) {

  }


  registerContaTerceiro(value: ContaTerceiro): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/contaTerceiro', value, { headers })
  }

  updateContaTerceiro(id: number,value: ContaTerceiro): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/contaTerceiro/${id}`;

    return this.http.put(path, value, { headers })
  }

  getListContasPorIdTerceiro(id: number): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/contaTerceiro/terceiro/${id}`;

    return this.http.get(path, { headers })
  }

  getContaPorIdTerceiro(id: number): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/contaTerceiro/${id}`;

    return this.http.get(path, { headers })
  }

  deleteContaTerceiroById(id: number): Observable<any>{
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ??'',
      tokenCliente: pTokenCliente??''
    });

    const path = `${this.url}api/contaTerceiro/${id}`;

    return this.http.delete( path, { headers });
  }

  registerContaUsuario(value: ContaUsuario): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/conta', value, { headers })
  }

  getListContasPorTokenUsuario(): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/conta/usuario`;

    return this.http.get(path, { headers })
  }

  getListContasPorIdUsuario(id: number): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/conta/usuario/${id}`;

    return this.http.get(path, { headers })
  }

  getContaPorIdUsuario(id: number): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });
    const path = `${this.url}api/conta/${id}`;

    return this.http.get(path, { headers })
  }

  deleteContaUsuarioById(id: number): Observable<any>{
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ??'',
      tokenCliente: pTokenCliente??''
    });

    const path = `${this.url}api/conta/${id}`;

    return this.http.delete( path, { headers });
  }

  updateContaUsuario(id: number,value: ContaUsuario): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/conta/${id}`;

    return this.http.put(path, value, { headers })
  }


}
