import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {AuthService} from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorServiceInterceptor {
  helper = new JwtHelperService();
  constructor(private router: Router, public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   if (localStorage.getItem('token')){
      const token = localStorage.getItem('token');
      if (this.helper.isTokenExpired(token)){
        this.router.navigate(['/login']);
      }
      // console.log(token);
      const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            // Accept: `application/json`
          }
        });
      return next.handle(newRequest);
    }
   return next.handle(request);
  }
}
