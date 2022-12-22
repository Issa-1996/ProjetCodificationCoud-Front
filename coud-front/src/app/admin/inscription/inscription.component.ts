import { AuthService } from '../../Service/auth-service.service';
import { EtudiantModel } from '../../Model/etudiant-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehavioSubjetService } from 'src/app/Service/behavio-subjet.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  addForm: FormGroup;
  pageCurrent = 1;
  totalPage = 1;
  erreurPrenom = '';
  erreurEmail = '';
  erreurNom = '';
  erreur = '';
  listAdmin: EtudiantModel[] = [];
  sending = false;
  spinner: boolean = false;
  btnText = 'Envoyer';
  constructor(private formBuilder: FormBuilder, private router: Router, private authServive: AuthService, private behavioSubjet: BehavioSubjetService) { }

  ngOnInit(): void {
    this.listeAdmin(this.pageCurrent);
    this.addForm = this.formBuilder.group({
      prenoms: ['', Validators.required],
      nom: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
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
    if (this.addForm.invalid){
      return;
    }
    this.sending = true;
    this.btnText = 'Verification...';
    this.subscribe(this.addForm.value);
  }

  subscribe(student: any): any{
    // this.behavioSubjet.setValue(this.addForm.value);
    this.authServive.addAdmin(student)
    .subscribe(
      (data) => {
        if(this.listAdmin.length == 10){
          this.listeAdmin(this.totalPage+1);
        }
        else {
          this.listeAdmin(this.totalPage);
        }
          this.addForm.reset();
          this.sending = false;
          this.btnText = 'Envoyer';
          return;
      },
      (error) => {
        // @ts-ignore
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
    this.router.navigate(['/admin/reservation']);
  }

  lastPage = 1;
  listeAdmin(page: number): any{
    // this.behavioSubjet.getValue().subscribe(
      //   (data)=>{
        //     console.log(data );
        // })
    this.pageCurrent = page;
    this.spinner = true;
    return this.authServive.getAllAdmin(+this.pageCurrent)
      .subscribe(
        data => {
          // console.log(data);
          this.listAdmin = data['hydra:member'];
          const totalPage = data['hydra:totalItems'] / 10;
          this.totalPage = (Math.ceil(totalPage));
          const lastStr: string = data['hydra:view']['hydra:last']?data['hydra:view']['hydra:last']:(data['hydra:view']['hydra:next']?data['hydra:view']['hydra:next']:'');
          this.lastPage = lastStr.length ? +lastStr.charAt(lastStr.length - 1):1;
          this.spinner = false;
          // console.log(this.lastPage);
        }
      );
  }
  archive(user: EtudiantModel): any{
    this.authServive.archiveAdmin(user)
    .subscribe( data => {
      this.listAdmin[this.listAdmin.indexOf(user)] = data;
      alert('Statut changé !');
    });
  }
}
