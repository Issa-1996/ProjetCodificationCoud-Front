import { EtudiantService } from '../../Service/etudiant.service';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth-service.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {EtudiantModel} from '../../Model/etudiant-model';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { StatutEtudiant } from 'src/app/Model/StatutEtudiant';


@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent implements AfterViewInit, OnInit  {
  afficher: boolean;
  cacheBtn = false;
  username: any;
  helper = new JwtHelperService();
  userConn$: Observable<EtudiantModel>;
  statutEtudiant$: Observable<StatutEtudiant>;
  quotaLit$: Observable<number>;
  tabMoyennes = [];
  userConnected: EtudiantModel;
  displayedColumns: string[] = ['username', 'prenoms', 'nom', 'moyenne', 'rang'];
  dataSource: MatTableDataSource<EtudiantModel> = new MatTableDataSource([]);

  // Pagination
  myPageEvent: PageEvent;
  myPageIndex = 1;
  myPageSize = 5;
  myPageLength: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router: Router,
              private authService: AuthService,
              private etudiantservice: EtudiantService) {
                this.userConnected = JSON.parse(localStorage.getItem('connectedUser'));
  }

  anneeToStr = new Date().getFullYear().toString();
  reserved = false;
  rang = 0;
  statut = "Non disponible";

  // tslint:disable-next-line:typedef
  async ngOnInit() {
    this.etudiantservice.getUserConnected(this.userConnected.username).subscribe(
      (res) => {
        this.userConnected = res['hydra:member'][0];
        this.userConnected.reservation.filter(
          // tslint:disable-next-line:triple-equals
          (r) => {if (r.annee == this.anneeToStr){
            this.reserved = true;
            return;
          }}
        );
      }
    );
    this.getRang()
  }

  getRang(){
    this.etudiantservice.getEtudiantRang(this.userConnected.niveau.nom).subscribe(
      (rang: any[])=>{
        this.tabMoyennes = rang['hydra:member']
        
        this.tabMoyennes = this.tabMoyennes.map(
          (etu: any) => +etu.moyenne
        )

        this.rang = this.tabMoyennes.indexOf(+this.userConnected.moyenne)+1;
        
        const statutEtudiant = {
          nombreInscrits: rang['hydra:totalItems'],
          rang: this.tabMoyennes.indexOf(+this.userConnected.moyenne)+1
        };

        this.statutEtudiant$ = of(statutEtudiant);
        this.getQuotaNiveau()
        // console.log(this.tabMoyennes.filter((v: any) => (v.moyenne == this.userConnected.moyenne)).length);
      }
    )
  }

  getEtudiantApi(niveau: string, pageIndex: number, pageSize: number): any{
    this.etudiantservice.getEtudiantApi(niveau, pageIndex, pageSize).subscribe(
      (data: any[]) => {
        this.myPageLength = data['hydra:totalItems'];
        this.dataSource = new MatTableDataSource(data['hydra:member']); // Les étudiants de son niveau        
        
      }
    );
  }

  showClose = false;
  filter='';
  spinner = false

  applyFilter(event: Event): any {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length>=6) {
      this.spinner = true
      this.etudiantservice.getOneEtudiantApi(this.userConnected.niveau.nom, filterValue.trim()).subscribe(
        (userConnect: EtudiantModel)=>{ 
          this.spinner = false;
          if(userConnect['hydra:member'].length!=0){
            this.dataSource = new MatTableDataSource(userConnect['hydra:member']);
            this.myPageLength = userConnect['hydra:totalItems'];
            this.showClose = true;
          }
        }
      )
    }
  }


  reloadList(){
    this.showClose = false;
    this.filter = '';
    this.getEtudiantApi(this.userConnected.niveau.nom, 1, 5);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  validerReserve(): any{
    this.etudiantservice.reservation(this.userConnected).subscribe(
      (data) => {
        this.etudiantservice.getUserConnected(this.userConnected.username).subscribe(
          (res) => {
            this.reserved = true;
            this.userConnected = res['hydra:member'][0];
          }
        );
      }
    );
  }

  // Pagination
  public getServerData(event?: PageEvent): any{
    if ((event.pageIndex  + 1) > this.myPageIndex ) {
      this.myPageIndex = event.pageIndex  + 1;
    } else if ((event.pageIndex + 1) < this.myPageIndex ) {
      this.myPageIndex = event.pageIndex + 1;
    }
    this.getEtudiantApi(this.userConnected.niveau.nom, this.myPageIndex, event.pageSize);
  }

  logOout(): any{
    this.authService.isLogOut();
    this.router.navigate(['/']);
  }

  getQuotaNiveau(): any{
    this.etudiantservice.getQuotaNiveau(this.userConnected.niveau.nom).subscribe(
      (quota: any[]) => {
        const nbLit: number = quota['hydra:member'].length;
        this.quotaLit$ = of(nbLit)
        if (nbLit>=this.rang) {
          this.statut = "Eligible";
        }
        else if(quota['hydra:member'].length!=0){
          this.statut = "Non éligable";
        }
        this.getEtudiantApi(this.userConnected.niveau.nom, 1, 5);
      }
    )
  }

}
