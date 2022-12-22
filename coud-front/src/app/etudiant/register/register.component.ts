import { EtudiantService } from '../../Service/etudiant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  addForm: FormGroup;

  erreurEtudiant = '';
  erreurCni = '';
  erreurDate = '';
  erreurEmail = '';
  erreurPassword = '';
  erreurConfirm = '';
  erreur = '';
  code = '';
  sending = false;
  btnText = 'Envoyer';
  constructor(private formBuilder: FormBuilder, private router: Router, private etudiantService: EtudiantService) { }

  ngOnInit(): void {
    localStorage.removeItem('token');

    this.addForm = this.formBuilder.group({
      numEtudiant: ['', Validators.required],
      numIdentite: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.addForm.get('numEtudiant').valueChanges.subscribe(
      () => { this.erreurEtudiant = ''; this.erreur = ''; }
    );
    this.addForm.get('numIdentite').valueChanges.subscribe(
      () => { this.erreurCni = ''; this.erreur = ''; }
    );
    this.addForm.get('dateNaissance').valueChanges.subscribe(
      () => { this.erreurDate = ''; this.erreur = ''; }
    );
    this.addForm.get('email').valueChanges.subscribe(
      () => { this.erreurEmail = ''; this.erreur = ''; }
    );
    this.addForm.get('password').valueChanges.subscribe(
      () => { this.erreurPassword = ''; this.erreur = ''; }
    );
    this.addForm.get('confirmPassword').valueChanges.subscribe(
      () => { this.erreurConfirm = ''; this.erreur = ''; }
    );
  }

  onSignIn(): any{
    if (this.addForm.get('numEtudiant').value.trim() === ''){
      this.erreurEtudiant = 'Numero étudiant obligatoire !';
    }
    if (this.addForm.get('numIdentite').value.trim() === ''){
      this.erreurCni = 'CNI obligatoire !';
    }
    if (this.addForm.get('dateNaissance').value.trim() === ''){
      this.erreurDate = 'Date de naissance obligatoire !';
    }
    if (this.addForm.get('email').value.trim() === ''){
      this.erreurEmail = 'Email obligatoire !';
    }
    else if (this.addForm.get('email').invalid){
      this.erreurEmail = 'Email incorrect !';
    }
    if (this.addForm.get('password').value.trim() === ''){
      this.erreurPassword = 'Mot de passe obligatoire !';
    }
    if (this.addForm.get('confirmPassword').value.trim() === ''){
      this.erreurConfirm = 'Confirmation obligatoire !';
    }
    else if (this.addForm.get('confirmPassword').value !== this.addForm.get('password').value){
      this.erreurConfirm = 'Mots de passes différents !';
      return;
    }
    if (this.addForm.invalid){
      return;
    }
    this.sending = true;
    this.btnText = 'Vérification...';
    this.subscribeStudent(this.addForm.value);
  }

  // tslint:disable-next-line:typedef
  subscribeStudent(student: any){
    this.etudiantService.addEtudiant(student)
      .subscribe(
        (data) => {
        this.router.navigate(['/']);
      },
      (error) => {
        // @ts-ignore
        if (error.status === 403){
          this.erreur = error.error;
        }
        else{
          this.erreur = 'Une erreur s\'est produite !';
        }
        this.sending = false;
        this.btnText = 'Envoyer';
        return;
      });
  }

}
