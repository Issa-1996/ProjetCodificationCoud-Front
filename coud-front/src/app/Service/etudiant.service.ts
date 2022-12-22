import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, pipe} from 'rxjs';
import {EtudiantModel} from '../Model/etudiant-model';
import {map} from 'rxjs/operators';
import { envVars } from 'src/envVars';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  headers = new HttpHeaders({Accept: '*/*'});

  private headerJson = new HttpHeaders({'Content-type': 'application/json'});

  constructor(private http: HttpClient) {
  }
  annee = new Date().getFullYear();

  reservation(user: any): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<any>(`${envVars.url}/etudiant/reserver`,
      {etudiant: `/api/etudiant/${user.id}`} , {headers: this.headers});
  }
  getEtudiant(niveau?: string): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/liste`);
  }
  getReser(pageIndex= 1, pageSize= 5): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/reservations?page=${pageIndex}&itemsPerPage=${pageSize}&reservation.annee=${this.annee}`);
  }

  getCodification(pageIndex= 1, pageSize= 5): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/liste?page=${pageIndex}&itemsPerPage=${pageSize}&reservation.annee=${this.annee}&reservation.affectation.annee=${this.annee}`);
  }

  getReservationByNiveau(niveau: string, pageIndex= 1, pageSize= 5): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/reservations?page=${pageIndex}&itemsPerPage=${pageSize}&reservation.annee=${this.annee}&niveau.nom=${niveau}`);
  }

  getCodificationByNiveau(niveau: string, pageIndex= 1, pageSize= 5): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/liste?page=${pageIndex}&itemsPerPage=${pageSize}&reservation.annee=${this.annee}&reservation.affectation.annee=${this.annee}&niveau.nom=${niveau}`);
  }

  getFinalResults(niveau: string, pageIndex= 1, pageSize= 5): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/reservations?page=${pageIndex}&itemsPerPage=${pageSize}&etudiant.niveau.nom=${niveau}&affectation.annee=${this.annee}`);
  }

  postusers(body: any): any{
    return this.http.post(`${envVars.url}/etudiant`, body, { headers : this.headerJson});
  }
  getUserConnected(codeEtudiant: any): Observable<EtudiantModel>{
    return this.http.get<EtudiantModel>(`${envVars.url}/etudiant/liste?username=${codeEtudiant}`);
  }
  getAdminConnected(codeEtudiant: any): Observable<EtudiantModel>{
    return this.http.get<EtudiantModel>(`${envVars.url}/admin/liste?username=${codeEtudiant}`);
  }

  getEtudiantRang(niveau?: string): Observable<any[]> {
    return this.http.get<any>(`${envVars.url}/etudiant_api/rang?niveauFormation=${niveau}&pagination=false`);
  }

  getEtudiantApi(niveau?: string, pageIndex= 1, pageSize= 5): Observable<any[]> {
    return this.http.get<any>(`${envVars.url}/etudiant_apis?niveauFormation=${niveau}&page=${pageIndex}&itemsPerPage=${pageSize}`);
  }

  getOneEtudiantApi(niveau: string, numero: string): Observable<EtudiantModel> {
    return this.http.get<any>(`${envVars.url}/etudiant_apis?niveauFormation=${niveau}&numero=${numero}`);
  }

  postEtudiantApi(body: any): any{
    return this.http.post(`${envVars.url}/etudiant_apis`, body, { headers : this.headerJson});
  }

  /**
   * Methode pour recupérer les etudiants de l'api de DISI
   */
   readApiEtudiant(): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>('/gestionPedagoqique/etudiantCoud/31');
   }
   addEtudiant(etudiant: any): Observable<EtudiantModel> {
    return this.http.post<EtudiantModel>(`${envVars.url}/etudiant/inscription`, etudiant, {headers: this.headers});
  }

  getConvention(niveau?: string): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/liste?niveau.nom=${niveau}&reservation.annee=${this.annee}&reservation.affectation.annee=${this.annee}`);
  }

  getEtudiantCodif(codeEtudiant: any, niveau: string): Observable<EtudiantModel>{
    return this.http.get<EtudiantModel>(`${envVars.url}/reservations?etudiant.username=${codeEtudiant}&affectation.annee=${this.annee}&etudiant.niveau.nom=${niveau}`);
  }

  adminGetEtudiantCodif(codeEtudiant: string): Observable<EtudiantModel>{
    return this.http.get<EtudiantModel>(`${envVars.url}/etudiant/liste?username=${codeEtudiant}&reservation.annee=${this.annee}&reservation.affectation.annee=${this.annee}`);
  }

  getEtudiantReser(codeEtudiant: any): Observable<EtudiantModel>{
    return this.http.get<EtudiantModel>(`${envVars.url}/etudiant/liste?username=${codeEtudiant}&reservation.annee=${this.annee}`);
  }

  getQuotaNiveau(niveau: any): Observable<any>{
    return this.http.get<any>(`${envVars.url}/quotas?niveau.nom=${niveau}&annee=${this.annee}`);
  }
}

