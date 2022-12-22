import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from './Service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ListGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  // tslint:disable-next-line:typedef
    canActivate(){
    if (this.auth.hasToken()) {
    const result = localStorage.getItem(('resultat'));
    if (result === 'false') {
    this.router.navigate(['/accueil/liste']);
    return false;
    }
  }
    return true;
  }
}
