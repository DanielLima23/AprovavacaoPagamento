import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { RequestRelatorioPedidos } from 'app/models/auxiliar/request-relatorio-pedidos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private url = Data.url

  constructor(private http: HttpClient,
    private tokenService: TokenService) {

  }

  criarPedido(pReqPedido: UntypedFormGroup): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/NovoPedido', pReqPedido, { headers })
  }


  criarPedidoTerceiro(pReqPedido: UntypedFormGroup): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/NovoPedidoTerceiro', pReqPedido, { headers })
  }

  getPedidoById(pIdPedido: number): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      IDPedido: pIdPedido
    });

    return this.http.get(this.url + 'api/pedido/', { headers })
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

  getListStatusPedido(): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
    });

    return this.http.get(this.url + 'api/pedido/RetornaListaStatusPedidos', { headers })
  }

  getAnexoByIdPedido(id: number): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      idPedido: id
    });

    return this.http.get(this.url + 'api/pedido/RetornaAnexoPedido', { headers })
  }

  aprovarPedido(requestAprovaPedido: any): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
    });

    return this.http.put(this.url + 'api/pedido/AprovarPedido', requestAprovaPedido, { headers })
  }

  getListPedidosUsuario(): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
    });

    return this.http.get(this.url + 'api/pedido/RetornaListaStatusPedidosUsuario', { headers })
  }

  // getListParcelasPendentesPorData(date: string): Observable<any> {
  //   const pTokenUsuario = this.tokenService.getToken();
  //   const pTokenCliente = this.tokenService.getTokenCliente();

  //   const headers = new HttpHeaders({
  //     tokenUsuario: pTokenUsuario ?? '',
  //     tokenCliente: pTokenCliente ?? '',
  //     dataReferencia: date
  //   });

  //   return this.http.get(this.url + 'api/pedido/RetornaListaParcelasPorDiaReferencia', { headers })
  // }

  getListParcelasPendentes(): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/pedido/RetornaListaParcelasPendente', { headers })
  }


  pagarParcela(parcelasId: any): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/AtualizarPagamento', parcelasId,{ headers })
  }

  getPedidosUsuarioPorData(requestRelatorioPedido: RequestRelatorioPedidos): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/RelatorioPedidosUsuario',requestRelatorioPedido, { headers })
  }

  getPedidosUsuarioPorDataAdm(requestRelatorioPedido: RequestRelatorioPedidos): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/RelatorioPedidosADM', requestRelatorioPedido,{ headers })
  }

  getPagamentosPorDataAdm(requestRelatorioPedido: RequestRelatorioPedidos): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/pedido/RelatorioPagamentosADM', requestRelatorioPedido,{ headers })
  }

  getUltimoPedidoUsuario(){
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/pedido/RetornaUltimoPedidoPorUsuario',{ headers })
  }

  getUltimoPedidoTerceiro(terceiroID: any){
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      terceiroID: terceiroID
    });

    return this.http.get(this.url + 'api/pedido/RetornaUltimoPedidoTerceiro',{ headers })
  }


  getPedidoPorParcelaId(parcelaID: any){
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      parcelaID: parcelaID
    });

    return this.http.get(this.url + 'api/pedido/RetornaPedidoPorParcelaId',{ headers })
  }

  getListObservacaoPorPedidoId(idPedido: any){
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? '',
      idPedido: idPedido
    });

    return this.http.get(this.url + 'api/pedido/RetornaListaObservacoes',{ headers })
  }


}
