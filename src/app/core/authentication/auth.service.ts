import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, Observable, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { RegistroRequest } from 'app/models/registro-request';
import { UntypedFormGroup } from '@angular/forms';
import { Data } from 'app/data/data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>({});
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );
  private url = Data.url


  get tokenUsuario(): string {
    const pToken = this.tokenService.getToken();
    return pToken;
  }

  get tokenCliente(): string {
    const pToken = this.tokenService.getTokenCliente();
    return pToken;
  }


  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private http: HttpClient
  ) { }

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }

  register(registroRequest: UntypedFormGroup, tokenCliente: string): Observable<any> {

    // const headers = new HttpHeaders({
    //   tokenCliente: this.tokenCliente ?? '',
    // });

    return this.http.post(this.url + 'api/usuario/registerLink/'+ tokenCliente, registroRequest,)
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }

  hasPermission(userRoles: any, routeRoles: any): boolean {
    if (!Array.isArray(userRoles)) {
      userRoles = [userRoles];
    }
    if (!Array.isArray(routeRoles)) {
      routeRoles = [routeRoles];
    }
    return routeRoles.some((role:any) => userRoles.includes(role));
  }
}
