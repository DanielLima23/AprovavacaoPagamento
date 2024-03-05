import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { Terceiro } from 'app/models/terceiro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private url = Data.url

  constructor(private http: HttpClient,
    private tokenService: TokenService) {

  }

  registerFornecedor(centro: Terceiro) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/centroDeCustos',centro, { headers })
  }
  
  
}
