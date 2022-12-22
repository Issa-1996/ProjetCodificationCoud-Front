import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { envVars } from 'src/envVars';
import { Chambre } from '../Model/chambre-model';

@Injectable({
  providedIn: 'root'
})
export class ChambreServiceService {

  constructor(private httpClient: HttpClient) { }
  readChambre(): Observable<Chambre[]> {
    return this.httpClient.get<Chambre[]>(envVars.url+'/api/chambre', {headers: {'Content-Type': 'application/json'}});
  }
  getChambre(pavillon?: string): Observable<Chambre[]> {
    return this.httpClient.get<Chambre[]>(`${envVars.url}/chambre?pavillon.nom=${pavillon}`);
  }
  getPavillon(campus?: string): Observable<Chambre[]> {
    return this.httpClient.get<Chambre[]>(`${envVars.url}/pavillon?campus.nom=${campus}`);
  }
}

