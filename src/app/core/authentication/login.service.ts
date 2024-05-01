import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';
import { CentroDeCustoService } from 'app/routes/administracao/centro-de-custo/centro-de-custo.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected http: HttpClient, public centroCustoService: CentroDeCustoService) {}

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/me');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
  }

  isResponsavelCentro(){
    this.centroCustoService.getListCentroDeCustoPorResponsavel().subscribe(
      (data:any) => {
        return data;
      }
    )
  }
}
