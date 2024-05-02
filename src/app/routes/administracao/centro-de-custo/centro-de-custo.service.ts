import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
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
    private tokenService: TokenService) {

  }

  get tokenUsuario(): string {
    const pToken = this.tokenService.getToken();
    return pToken;
  }

  get tokenCliente(): string {
    const pToken = this.tokenService.getTokenCliente();
    return pToken;
  }


  getListaCentroDeCusto(): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/centroDeCustos/', { headers })
  }

  getListaResponsaveis(): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/usuario/retornaUsuariosAprovados', { headers })
  }

  registerCentroCusto(centro: UntypedFormGroup): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.post(this.url + 'api/centroDeCustos', centro, { headers })
  }

  updateCentroCusto(id: number, centro: UntypedFormGroup): Observable<any> {
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/centroDeCustos/${id}`;


    return this.http.put(path, centro, { headers })
  }

  deleteById(pCodigoCentro: number): Observable<any> {
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();


    const headers = new HttpHeaders({
      tokenUsuario: pToken ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/centroDeCustos/${pCodigoCentro}`;

    return this.http.delete(path, { headers });
  }


  getById(id: number): Observable<any> {
    const pToken = this.tokenService.getToken()
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pToken ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    const path = `${this.url}api/centroDeCustos/${id}`;

    return this.http.get(path, { headers });
  }

  getListCentroDeCustoPorResponsavel(): Observable<any>{
    const pTokenUsuario = this.tokenService.getToken();
    const pTokenCliente = this.tokenService.getTokenCliente();

    const headers = new HttpHeaders({
      tokenUsuario: pTokenUsuario ?? '',
      tokenCliente: pTokenCliente ?? ''
    });

    return this.http.get(this.url + 'api/centroDeCustos/RetornaPorResponsavel', { headers })
  }

}
