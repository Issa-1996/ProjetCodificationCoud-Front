import { AuthService } from '../Service/auth-service.service';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EtudiantService } from '../Service/etudiant.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  addForm: FormGroup;
  helper = new JwtHelperService();
  username: any;
  erreurLogin = '';
  erreurPassword = '';
  erreur = '';
  constructor(private formBuilder: FormBuilder, private router: Router,
              private authService: AuthService, private etudiantservice: EtudiantService) { }
  hide = true;
  sending = false;
  btnText = 'Connexion';

  ngOnInit(): void {
    localStorage.removeItem('token');
    this.addForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.addForm.get('login').valueChanges.subscribe(
      () => { this.erreurLogin = ''; this.erreur = ''; }
    );
    this.addForm.get('password').valueChanges.subscribe(
      () => { this.erreurPassword = ''; this.erreur = ''; }
    );
  }

  onSignIn(): any {
    if (this.addForm.get('login').value.trim() === '') {
      this.erreurLogin = 'Login obligatoire !';
    }
    if (this.addForm.get('password').value.trim() === '') {
      this.erreurPassword = 'Mot de passe obligatoire !';

    } else {
      if (this.addForm.invalid){
        return;
      }
      this.sending = true;
      this.btnText = 'Patientez...';
      this.authService.isLogin(this.addForm.get('login').value, this.addForm.get('password').value).subscribe(
        (data: any) => {
        //  console.log(data);
          localStorage.setItem('token', data.token);
          const decodedToken = this.helper.decodeToken(data.token);
          this.etudiantservice.getUserConnected(decodedToken.username).subscribe(
            (res) => {
              localStorage.setItem('connectedUser', JSON.stringify(res['hydra:member'][0]));
              const roles: string[] = decodedToken.roles;
              if (roles.includes('ROLE_ETUDIANT')){
                this.etudiantservice.getFinalResults(res['hydra:member'][0].niveau.nom, 1, 5).subscribe(
                  // tslint:disable-next-line:no-shadowed-variable
                  ( data) => {
                    // tslint:disable-next-line:no-shadowed-variable
                    const res: any[] = data['hydra:member'];
                    // tslint:disable-next-line:triple-equals
                    if (res.length != 0) {
                      localStorage.setItem('resultat', 'true');
                      this.router.navigate(['/e&12t/xxa1PzTd86HNGnfdy(dTHJH23:dg;/e&12t/rere/hurg']);
                    }
                    else{
                      localStorage.setItem('resultat', 'false');
                      this.router.navigate(['/e&12t/xxa1PzTd86HNGnfdy(dTHJH23:dg;/e&12t/llla/1PzT']);
                    }
                  },
                  (error: any) => {
                    this.erreur = 'Une erreur est survenue.';
                    return;
                  });
              }else if (roles.includes('ROLE_ADMIN')){
                this.router.navigate(['/e&12t/xxa1PzTd86HNGnfdy(dTHJH23:dg;/e&12t/rrr/xa1zT']);
              }
            }
          );
        },
        (error) => {
          // console.log(error);
          if (error.status === 500 || error.status === 0) {
            this.erreur = 'Erreur. Veillez resseyer svp.';
            this.sending = false;
            this.btnText = 'Connexion';
            return;
          }
          else{
          this.sending = false;
          this.btnText = 'Connexion';
          this.erreur = 'Login ou mot de passe incorrect.';
          }
        }
      );
    }
  }
}
