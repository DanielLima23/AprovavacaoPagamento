import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { Terceiro } from 'app/models/terceiro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerceiroService {

  private url = Data.url

  constructor(private http: HttpClient,
    private tokenService: TokenService) {

  }


  registerTerceiro(terceiro: UntypedFormGroup) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
     tokenUsuario: pTokenUsuario ??'',
     tokenCliente: pTokenCliente ?? ''
   });

    return this.http.post(this.url + 'api/terceiros',terceiro, { headers })
  }

  updateTerceiro(id: number,terceiro: Terceiro) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
     tokenUsuario: pTokenUsuario ??'',
     tokenCliente: pTokenCliente ?? ''
   });
    const path = `${this.url}api/terceiros/${id}`;
    return this.http.put(path,terceiro, { headers })
  }

  getTerceiroById(pCodigoFornecedor: number): Observable<any>{
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ??'',
      tokenCliente: pTokenCliente??''
    });

    const path = `${this.url}api/terceiros/${pCodigoFornecedor}`;

    return this.http.get( path, { headers });
  }

  getListaTerceiroPorCliente(): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/terceiros/', { headers })
  }

  deleteTerceiroById(pCodigoFornecedor: number): Observable<any>{
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ??'',
      tokenCliente: pTokenCliente??''
    });

    const path = `${this.url}api/terceiros/${pCodigoFornecedor}`;

    return this.http.delete( path, { headers });
  }
}
