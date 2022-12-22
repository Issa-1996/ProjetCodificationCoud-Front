import { JwtHelperService } from '@auth0/angular-jwt';
import { EtudiantService } from '../Service/etudiant.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../Service/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehavioSubjetService } from '../Service/behavio-subjet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  addForm: FormGroup;

  helper = new JwtHelperService();
  erreurPrenom = '';
  erreurEmail = '';
  erreurPassword = '';
  erreurNom = '';
  erreur = '';
  code = '';
  sending = false;
  btnText = 'Envoyer';
  user: any;
  public  role: any[];
  constructor(private etudiantService: EtudiantService ,
              private formBuilder: FormBuilder,
              private router: Router,
              private authServive: AuthService,
              private behavioSubjet: BehavioSubjetService) { }

  ngOnInit(): void {
    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    this.role = decodedToken.roles;
    // console.log(this.role);
    this.getUserConnected();
    this.addForm = this.formBuilder.group({
      id: [''],
      prenoms: ['', Validators.required],
      nom: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: [''],
    });
    this.addForm.get('prenoms').valueChanges.subscribe(
      () => { this.erreurPrenom = ''; this.erreur = ''; }
    );
    this.addForm.get('nom').valueChanges.subscribe(
      () => { this.erreurNom = ''; this.erreur = ''; }
    );
    this.addForm.get('username').valueChanges.subscribe(
      () => { this.erreurEmail = ''; this.erreur = ''; }
    );
    this.addForm.get('password').valueChanges.subscribe(
      () => { this.erreurPassword = ''; this.erreur = ''; }
    );
  }

  onSignIn(): any{
    if (this.addForm.get('prenoms').value.trim() === ''){
      this.erreurPrenom = 'Prénom admin obligatoire !';
    }
    if (this.addForm.get('nom').value.trim() === ''){
      this.erreurNom = 'Nom admin obligatoire !';
    }
    if (this.addForm.get('username').value.trim() === ''){
      this.erreurEmail = 'Email obligatoire !';
    }
    else if (this.addForm.get('username').invalid){
      this.erreurEmail = 'Email incorrect !';
    }
    if (this.addForm.get('password').value.trim() === ''){
      delete this.addForm.value.password;
      // console.log(this.addForm.value);
    }
    if (this.addForm.invalid){
      return;
    }
    this.sending = true;
    this.btnText = 'Verification...';
    // console.log(this.addForm.value.password);

    this.subscribe(this.addForm.value);
  }

  subscribe(student: any): any{
    this.authServive.updateInfoAdmin(student)
      .subscribe(
        (data) => {
          // this.addForm.reset();
          this.sending = false;
          this.btnText = 'Envoyer';
          // this.user.push(this.addForm.value);
          location.reload()
          // this.router.navigate(['/login']);
          return;
      },
      (error) => {
        if (error.status === 500){
          this.erreur = 'déja inscrit, connectez-vous !';
          this.sending = false;
          this.btnText = 'Envoyer';
          return;
        }
      });
  }
  logOout(): any {
    this.authServive.isLogOut();
    this.router.navigate(['/']);
  }
  getUserConnected(): any{
    const decodedToken = this.helper.decodeToken(localStorage.getItem('token'));
    const username: string[] = decodedToken.username;
    // console.log(username);

    return this.etudiantService.getAdminConnected(username)
    .subscribe(
      (data) => {
        // console.log(data);
        this.user = data['hydra:member'][0];
        this.addForm.patchValue(this.user);
        // console.log(this.user);

        /*this.authServive.updateInfoAdmin(this.user)
        .subscribe( data => {
          this.addForm.patchValue(data);
      }); */
      });
  }
}
