import { EtudiantService } from '../../Service/etudiant.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {AuthService} from '../../Service/auth-service.service';
import {EtudiantModel} from '../../Model/etudiant-model';
import { ExcelService } from '../../Service/excel.service';
import {FaculteService} from '../../Service/faculte.service';
import {ReservationModel} from '../../Model/reservation-model';

@Component({
  selector: 'app-reservation-etudiant',
  templateUrl: './reservation-etudiant.component.html',
  styleUrls: ['./reservation-etudiant.component.css']
})
export class ReservationEtudiantComponent implements AfterViewInit {

  constructor(private router: Router,
              private authService: AuthService,
              private serviceEtudiant: EtudiantService,
              private faculteService: FaculteService,
              private excelService: ExcelService,
              private etudiantservice: EtudiantService) {

    this.getReservation(1, 5);

    this.getFaculte();
    this.getDepartements();
    this.getNiveaux();
  }
 // users: EtudiantModel[];
  displayedColumns: string[] = ['username', 'prenom', 'nom', 'moyenne'];
  dataSource: MatTableDataSource<EtudiantModel> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  faculte;
  departements;
  niveau;
  liste = [];
  niveauChoisi = '';
  lit: ReservationModel;
  // Pagination
  myPageEvent: PageEvent;
  myPageIndex = 1;
  myPageSize = 5;
  myPageLength: number;
  showClose = false;
  filter = '';
  spinner = false;

  exportAsXLSX(): void {
    if (this.niveauChoisi === '') {
      alert('Veillez séléctionner un Niveau pour exporter la liste.');
      return;
    }
    this.excelService.getListReser(this.niveauChoisi).subscribe(
      (data) => {
        // tslint:disable-next-line:triple-equals
        if (data.length == 0) {
          alert('Cette liste est vide.');
          return;
        }

        let arr = data.map(x => Object.assign({}, x, { Numero: x.username }));
        arr = arr.map(x => Object.assign({}, x, { Prenoms: x.prenoms }));
        arr = arr.map(x => Object.assign({}, x, { Nom: x.nom }));
        arr = arr.map(x => Object.assign({}, x, { Moyenne: x.moyenne }));
        arr = arr.map(x => Object.assign({}, x, { Num_Lit: '' }));

        arr.forEach(
          (obj) => {
            delete obj.username;
            delete obj.prenoms;
            delete obj.nom;
            delete obj.moyenne;
          }
        );

        this.excelService.exportAsExcelFile(arr, `${this.niveauChoisi}`);
      });

  }

  applyFilter(event: Event): any {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 6) {
      this.spinner = true;
      this.etudiantservice.getEtudiantReser(filterValue.trim()).subscribe(
        (userConnect: EtudiantModel) => {
          // tslint:disable-next-line:triple-equals
          this.spinner = false;
          if (userConnect['hydra:member'].length != 0){
            this.dataSource = new MatTableDataSource(userConnect['hydra:member']);
            this.myPageLength = userConnect['hydra:totalItems'];
            this.showClose = true;
          }
        }
      );
    }
  }

  // tslint:disable-next-line:typedef
  reloadList(){
    this.showClose = false;
    this.filter = '';
    // tslint:disable-next-line:triple-equals
    if (this.niveauChoisi != '') {
      this.getReservationByNiveau(this.niveauChoisi, this.myPageIndex, this.myPageSize);
    }
    else{
    this.getReservation( this.myPageIndex, this.myPageSize);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  logOout(): any{
    this.authService.isLogOut();
    this.router.navigate(['/']);
  }


  getFaculte(): any{
    this.faculteService.getFaculte().subscribe(
      (response: any) => {
      //  console.log(response);
        this.faculte = response['hydra:member'];
      });
  }
  getNiveaux(): any{
    this.faculteService.getNiveau().subscribe(
      (response: any) => {
        this.niveau = response['hydra:member'];
      //  console.log(this.niveau);
      });
  }
  getDepartements(): any{
    this.faculteService.getDepartement().subscribe(
      (response: any) => {
        this.departements = response['hydra:member'];
        // console.log(this.departements);
      });
  }
  getEtudiantByNiveau(niveau: string): any{
    this.niveauChoisi = niveau;
    this.getReservationByNiveau(niveau, 1, this.myPageSize);
  }

 getDepartByFaculte(departement: any): any{
  //  console.log(departement);
   return this.faculteService.getDeparts(departement).subscribe(
      (data: any) => {
        this.departements = data['hydra:member'];
      //  console.log(this.departements);
      });
  }

  getNiveauByDepartement(niveau: string): any{
    return this.faculteService.getNiveaux(niveau).subscribe(
      (data: any) => {
        this.niveau = data['hydra:member'];
       // console.log(this.niveau);
      });
  }

  // Pagination
  public getServerData(event?: PageEvent): any
  {
    // console.log(event);
    if ((event.pageIndex + 1) > this.myPageIndex ) {
      this.myPageIndex = event.pageIndex + 1;
    }else if ((event.pageIndex + 1) < this.myPageIndex ) {
      this.myPageIndex = event.pageIndex + 1;
    }

    // tslint:disable-next-line:triple-equals
    if (this.niveauChoisi != '') {
      this.getReservationByNiveau(this.niveauChoisi, this.myPageIndex, event.pageSize);
    }
    else{
    this.getReservation( this.myPageIndex, event.pageSize);
    }
  }

  getReservation( pageIndex: number, pageSize: number): any {
    this.serviceEtudiant.getReser(pageIndex, pageSize).subscribe(
      (data) => {
        this.myPageLength = data['hydra:totalItems'];
        this.dataSource = new MatTableDataSource(data['hydra:member']);
      },
      (error: any) => {
        // alert('Il ya erreur de recuperation');
      }
    );
  }

  getReservationByNiveau(niveau: string, pageIndex: number, pageSize: number): any {
    this.serviceEtudiant.getReservationByNiveau(niveau, pageIndex, pageSize).subscribe(
      (data) => {
        this.myPageLength = data['hydra:totalItems'];
        this.dataSource = new MatTableDataSource(data['hydra:member']);
      },
      (error: any) => {
        // alert('Il ya erreur de recuperation');
      }
    );
  }

  sendCollection(): any {
    this.authService.chargerEtudiantsCollection()
  }

}

