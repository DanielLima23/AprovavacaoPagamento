import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { RequestPedido } from 'app/models/auxiliar/request-pedido';
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

  criarPedido(pReqPedido: UntypedFormGroup) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ??'',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/NovoPedido',pReqPedido, { headers })
  }

  getPedidoById(pIdPedido: number) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      IDPedido: pIdPedido
    });

    return this.http.get(this.url + 'api/pedido/' , { headers })
  }

  // getStatusPedidoById(pIdPedido: number) : Observable<any>{
  //   const pTokenUsuario = this.tokenService.getToken();
  //   const pTokenCliente = this.tokenService.getTokenCliente();

  //   const headers = new HttpHeaders({
  //     tokenUsuario: pTokenUsuario ?? '',
  //     tokenCliente: pTokenCliente ?? '',
  //     idPedido: pIdPedido
  //   });

  //   return this.http.get(this.url + 'api/pedido/RetornaStatusPedido', { headers })
  // }

  getListStatusPedido() : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
    });

    return this.http.get(this.url + 'api/pedido/RetornaListaStatusPedidos', { headers })
  }

  getAnexoByIdPedido(id: number) : Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      idPedido: id
    });

    return this.http.get(this.url + 'api/pedido/RetornaAnexoPedido', { headers })
  }

  aprovarPedido(requestAprovaPedido: any):Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
    });

    return this.http.put(this.url + 'api/pedido/AprovarPedido',requestAprovaPedido, { headers })
  }



}
