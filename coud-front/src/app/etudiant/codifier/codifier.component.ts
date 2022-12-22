import { ConventionService } from '../../Service/convention.service';
import {AfterViewInit, Component, OnInit, ViewChild,  Input } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EtudiantModel} from '../../Model/etudiant-model';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {AuthService} from '../../Service/auth-service.service';
import {EtudiantService} from '../../Service/etudiant.service';
import {FaculteService} from '../../Service/faculte.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ExcelService} from '../../Service/excel.service';


@Component({
  selector: 'app-codifier',
  templateUrl: './codifier.component.html',
  styleUrls: ['./codifier.component.css']
})
export class CodifierComponent implements AfterViewInit {
  etudiant: EtudiantModel[] ;
  button = false;
  import = this.formBuilder.group({
    acceptfile: ['', Validators.required],
  });

  // Pagination
  myPageEvent: PageEvent;
  myPageIndex = 1;
  myPageSize = 5;
  myPageLength: number;

  message = 'La liste a été importée avec succès.';
  showMessage = false;
  waiting = false;

  constructor(private router: Router,
              private etudiantservice: EtudiantService,
              private faculteService: FaculteService,
              private serviceEtudiant: EtudiantService,
              private conventionService: ConventionService,
              private formBuilder: FormBuilder,
              private exelService: ExcelService) {

    this.getCodification(1, 5);

    this.getFaculte();
    this.getDepartements();
    this.getNiveaux();

  }
  faculte = [];
  departements = [];
  niveau = [];
  liste = [];

  displayedColumns: string[] = ['username', 'prenom', 'nom', 'convention'];
  dataSource: MatTableDataSource<EtudiantModel> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  declare: any ;
  niveauSelected = '';
  showClose = false;
  filter = '';
  spinner = false;

  applyFilter(event: Event): any {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length>=6) {
      this.spinner = true;
      this.etudiantservice.adminGetEtudiantCodif(filterValue.trim()).subscribe(
        (userConnect: EtudiantModel)=>{ 
          const user = userConnect['hydra:member'].length;   
          this.spinner = false;
          if(user!=0){
            this.dataSource = new MatTableDataSource(userConnect['hydra:member']);
            this.showClose = true;
            this.myPageLength = userConnect['hydra:totalItems'];
          }
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  generatePdf(etu: EtudiantModel): any{
    this.conventionService.genererConvention(etu);
  }

  generateAll(): any {
    if (this.dataSource.data.length === 0) {
      alert('Cette liste est vide.');
      return;
    }
    if (this.liste.length === 0) {
      alert('Veillez sélectionner un Niveau pour imprimer les conventions.');
      return;
    }

    localStorage.setItem('niveau', this.niveauSelected);
    this.router.navigate(['/e&12t/xxa1PzTd86HNGnfdy(dTHJH23:dg;/e&12t/coco/curt']);
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
    this.niveauSelected = niveau;
    this.getCodificationByNiveau(niveau, 1, this.myPageSize);
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

  afficher(): any {
    this.button = true;
  }
  // reset(): any {
  //   document.getElementById('file').reset();
  // }
  envoyer(): any{
    this.showMessage = false;
    this.message = 'La liste a été importée avec succès.';
    // Formulaire vide à cet instant
    this.waiting = !this.waiting;
    const formData = new FormData();
    formData.append('excelFile', this.import.value.acceptfile._files[0]);
    this.exelService.importList(formData).subscribe(
      (data: any[]) => {
        // tslint:disable-next-line:triple-equals
        if (data.length != 0) {
          this.message = data.toString();
        }
        this.showMessage = true;
        setTimeout(()=>{
          this.showMessage = false;
        },5000)
        this.button = false;
        this.waiting = !this.waiting;
        // tslint:disable-next-line:triple-equals
        if (this.niveauSelected != '') {
          this.getCodificationByNiveau(this.niveauSelected, 1, 5);
        }
        else{
          this.getCodification(this.myPageIndex, this.myPageSize);
        }
        this.import.reset();
        // document.getElementById('file').remove();
      },
      (error: any)=>{
        this.message = "Une erreur est servenue!"
        this.showMessage = true;
        setTimeout(()=>{
          this.showMessage = false;
        },5000)
        this.button = false;
        this.waiting = false;
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
    if (this.niveauSelected != '') {
      this.getCodificationByNiveau(this.niveauSelected, this.myPageIndex, event.pageSize);
    }
    else{
    this.getCodification( this.myPageIndex, event.pageSize);
    }
  }

  getCodification( pageIndex: number=1, pageSize: number=5): any {
    this.serviceEtudiant.getCodification(pageIndex, pageSize).subscribe(
      (data) => {
        this.myPageLength = data['hydra:totalItems'];
        this.dataSource = new MatTableDataSource(data['hydra:member']);
      },
      (error: any) => {
        // alert('Il ya erreur de recuperation');
      }
    );
  }

  getCodificationByNiveau(niveau: string, pageIndex: number=1, pageSize: number=5): any {
    this.serviceEtudiant.getCodificationByNiveau(niveau, pageIndex, pageSize).subscribe(
      (data) => {
        this.myPageLength = data['hydra:totalItems'];
        this.liste = data['hydra:member'];
        this.dataSource = new MatTableDataSource(data['hydra:member']);
      },
      (error: any) => {
        // alert('Il ya erreur de recuperation');
      }
    );
  }

  // tslint:disable-next-line:typedef
  reloadList(){
    this.showClose = false;
    this.filter = '';
    // tslint:disable-next-line:triple-equals
    if (this.niveauSelected != '') {
      this.getCodificationByNiveau(this.niveauSelected, this.myPageIndex, this.myPageSize);
    }
    else{
    this.getCodification( this.myPageIndex, this.myPageSize);
    }
  }
}
