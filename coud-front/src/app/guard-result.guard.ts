import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthService} from './Service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class GuardResultGuard implements CanActivate {
  helper = new JwtHelperService();
  constructor(public auth: AuthService, public router: Router) {}
  // tslint:disable-next-line:typedef
  canActivate() {
    if (this.auth.hasToken()) {
      const result = localStorage.getItem(('resultat'));
      // console.log(result);
      // @ts-ignore
      if (result === 'true') {
        this.router.navigate(['/accueil/resultat']);
        return false;
      }
    }
    return true;
  }

}
