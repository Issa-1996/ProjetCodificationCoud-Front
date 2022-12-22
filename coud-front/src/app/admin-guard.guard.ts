import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './Service/auth-service.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate{
  constructor(public auth: AuthService, public router: Router) {}
  helper = new JwtHelperService();
  // tslint:disable-next-line:typedef
  canActivate() {
    // console.log("fghbjnkjljkhgfd");

      if (this.auth.hasToken()) {
          const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
          // console.log(decodedToken.username);
          const roles: string[] = decodedToken.roles;
          if (roles.includes('ROLE_ETUDIANT')) {
            this.router.navigate(['/']);
            return false;
          }
      }
      return true;
  }
}
