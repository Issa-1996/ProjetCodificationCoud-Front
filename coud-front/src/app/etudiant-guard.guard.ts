import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './Service/auth-service.service';
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtudiantGuardGuard  implements CanActivate {
  helper = new JwtHelperService();
  constructor(public auth: AuthService, public router: Router) {}
  // tslint:disable-next-line:typedef
  canActivate() {
    // console.log("fghbjnkjljkhgfd");

      if (this.auth.hasToken()) {
          const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
          // console.log(decodedToken.username);
          const roles: string[] = decodedToken.roles;
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/']);
            return false;
          }
      }
      return true;
  }
}
