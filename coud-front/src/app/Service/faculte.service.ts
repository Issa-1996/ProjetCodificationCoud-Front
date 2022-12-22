import { Lit } from './../Model/chambre-model';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EtudiantModel} from '../Model/etudiant-model';
import {FaculteModel} from '../Model/faculte-model';
import {NiveauModel} from '../Model/niveau-model';
import {DepartementModel} from '../Model/departement-model';
import { Campus } from '../Model/chambre-model';
import { envVars } from 'src/envVars';

@Injectable({
  providedIn: 'root'
})
export class FaculteService {

  constructor(private http: HttpClient) {}

  getDepartByFaculte(id: number): Observable<any>{
    return   this.http.get(`${envVars.url}/facultes/${id}/departement`);
  }
  getNiveauByDepart(id: number): Observable<any>{
    return   this.http.get(`${envVars.url}/departement/${id}/niveau`);
  }
  getEtuByniveau(id: number): Observable<any>{
    return   this.http.get(`${envVars.url}/niveau/${id}/etudiant`);
  }
  getFaculte(): Observable<any>{
    return   this.http.get<FaculteModel[]>(`${envVars.url}/faculte`);
  }
  getNiveau(): Observable<any>{
    return   this.http.get<NiveauModel[]>(`${envVars.url}/niveau`);
  }
  getDepartement(): Observable<any>{
    return   this.http.get<DepartementModel[]>(`${envVars.url}/departement`);
  }

  getEtudiant(niveau?: string): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/liste?niveau.nom=${niveau}`);
  }
  getDeparts(faculte?: string): Observable<DepartementModel[]> {
    return this.http.get<DepartementModel[]>(`${envVars.url}/departement/liste?faculte.nom=${faculte}`);
  }
  getNiveaux(departement?: string): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/niveau/liste?departement.nom=${departement}`);
  }

  getCampus() {
    return   this.http.get<Campus[]>(`${envVars.url}/campus`);
  }

  getLits() {
    return   this.http.get<Lit[]>(`${envVars.url}/lits`);
  }
}
