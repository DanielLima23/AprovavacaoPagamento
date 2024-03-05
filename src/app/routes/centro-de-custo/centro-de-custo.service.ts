import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { CentroDeCusto } from 'app/models/centro-de-custo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CentroDeCustoService {

  private url = Data.url

  constructor(private http: HttpClient,
    private tokenService: TokenService) {}

  getListaCentroDeCusto(): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/centroDeCustos/', { headers })
  }

  getListaResponsaveis() : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/usuario/resposaveis', { headers })
  }

  registerCentroCusto(centro: CentroDeCusto) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/centroDeCustos',centro, { headers })
  }

  updateCentroCusto(id:number,centro: CentroDeCusto) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/centroDeCustos/${id}`;  


    return this.http.put(path,centro, { headers })
  }

  deleteById(pCodigoCentro: number): Observable<any>{
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ??'',
      tokenCliente: pTokenCliente??''
    });

    const path = `${this.url}api/centroDeCustos/${pCodigoCentro}`;

    return this.http.delete( path, { headers });
  }

  
  getById(pCodigoCentro: number): Observable<any>{
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ??'',
      tokenCliente: pTokenCliente??''
    });

    const path = `${this.url}api/centroDeCustos/${pCodigoCentro}`;

    return this.http.get( path, { headers });
  }
}
