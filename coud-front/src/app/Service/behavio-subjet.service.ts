import { EtudiantModel } from './../Model/etudiant-model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehavioSubjetService {

  private routerInfo: BehaviorSubject<EtudiantModel>;
  constructor() { 
    this.routerInfo = new BehaviorSubject<EtudiantModel>(null);
  }
  getValue(): Observable<EtudiantModel> {
    return this.routerInfo.asObservable();
  }
  setValue(newValue: EtudiantModel): void {
    this.routerInfo.next(newValue);
  }
}
