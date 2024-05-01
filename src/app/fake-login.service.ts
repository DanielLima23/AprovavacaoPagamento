import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { admin, LoginService, Menu, Token } from '@core';
import { catchError, find, map, switchMap } from 'rxjs/operators';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'environments/environment'
import { Data } from './data/data';
/**
 * You should delete this file in the real APP.
 */
@Injectable()
export class FakeLoginService extends LoginService {

  url: string = Data.url;

  private token: any;

  login(username: string, password: string): Observable<Token> {

    const headers = new HttpHeaders({
      usuario: username,
      senha: password,
    });

    return this.http.get(this.url + 'api/usuario/login', { headers }).pipe(
      map((data: any) => {
        this.token = { access_token: data.token, token_type: 'bearer', access_token_cliente: data.tokenCliente , roles: [data.usuarioCliente[0].tipo]} as Token;
        return this.token;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  refresh() {
    return of(this.token);
  }

  logout() {
    return of({});
  }

  me() {
    return of(admin);
  }

  menu() {
    return this.http
      .get<{ menu: Menu[] }>('assets/data/menu.json?_t=' + Date.now())
      .pipe(map(res => res.menu));
  }
}
