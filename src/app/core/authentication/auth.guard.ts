import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

export const authGuard = (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const tokenService = inject(TokenService)


  if (auth.check()) {
    const roles = tokenService.getRoles();
    const permissaoRotaAtual = route?.data.roles;
    if (permissaoRotaAtual && roles && auth.hasPermission(roles, permissaoRotaAtual)) {
      return true;
    } else {
      // this.router.navigateByUrl('/auth/login');
      return false;
    }
  } else {
    router.navigateByUrl('/auth/login');
    return false;
  }
}


// return auth.check() ? true : router.parseUrl('/auth/login');

