import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EtudiantModel} from '../Model/etudiant-model';
import { envVars } from 'src/envVars';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
  headersFata = new HttpHeaders({Accept: '*/*'});
  headersJson = new HttpHeaders({Accept: 'application/json'});

 // headerJson = new HttpHeaders({'Content-type': 'application/json'});
  constructor(private http: HttpClient) { }

  annee = new Date().getFullYear();

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = { Sheets: { data: myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    const date = new Date().toLocaleDateString().split('/').join('-');
    const hr = new Date().toLocaleTimeString().replace(':', 'h').substring(0, 5);
    FileSaver.saveAs(data, fileName + `__${date}_${hr}` + EXCEL_EXTENSION);
  }

  importList(body: any): any{
    return this.http.post(`${envVars.url}/admin/importList`, body, { headers : this.headersFata});
  }
  importListChambreLit(body: any): any{
    return this.http.post(`${envVars.url}/admin/importListChambre`, body, { headers : this.headersFata});
  }
  importListQuota(body: any): any{
    return this.http.post(`${envVars.url}/admin/importquota`, body, { headers : this.headersFata});
  }
  getListReser(niveau?: string): Observable<EtudiantModel[]> {
    return this.http.get<EtudiantModel[]>(`${envVars.url}/etudiant/reservations?pagination=false&niveau.nom=${niveau}&reservation.annee=${this.annee}`, { headers : this.headersJson});
  }
}
