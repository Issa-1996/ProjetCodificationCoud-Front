import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs';
import {EtudiantModel} from '../../Model/etudiant-model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {AuthService} from '../../Service/auth-service.service';
import {EtudiantService} from '../../Service/etudiant.service';

interface Lit {
  libelle: string;
}
@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.component.html',
  styleUrls: ['./resultat.component.css']
})
export class ResultatComponent implements OnInit {

  afficher: boolean;
  cacheBtn = false;

  numLit = null;
  username: any;
  helper = new JwtHelperService();
  userConn$: Observable<EtudiantModel>;
  userConnected: EtudiantModel;
  displayedColumns: string[] = ['username', 'prenoms', 'nom', 'lit'];
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

                this.getEtudiantApi(this.userConnected.niveau.nom, 1, 5);
  }

  ngOnInit(): void {
    this.etudiantservice.getUserConnected(this.userConnected.username).subscribe(
      (res) => {
        this.userConnected = res['hydra:member'][0];
      }
    );
  }

  showClose = false;
  filter='';
  spinner = false;
  applyFilter(event: Event): any {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length>=6) {
      this.spinner = true;
      this.etudiantservice.getEtudiantCodif(filterValue.trim(), this.userConnected.niveau.nom).subscribe(
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

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  validerReserve(): any{
    this.userConn$ = this.etudiantservice.reservation(this.userConnected);
  }

  // Pagination
  public getServerData(event?: PageEvent): any{
    // console.log(event);
    if ((event.pageIndex  + 1) > this.myPageIndex) {
      this.myPageIndex = event.pageIndex + 1;
    }
    else if ((event.pageIndex + 1) < this.myPageIndex ) {
      this.myPageIndex = event.pageIndex + 1;
    }
    this.getEtudiantApi(this.userConnected.niveau.nom, this.myPageIndex, event.pageSize);
  }

  getEtudiantApi(niveau: string, pageIndex: number, pageSize: number): any{
    this.etudiantservice.getFinalResults(niveau, pageIndex, pageSize).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data['hydra:member']);
        this.myPageLength = data['hydra:totalItems'];
        const res: any[] = data['hydra:member'];
        res.filter(
          (e) => {
            // tslint:disable-next-line:triple-equals
            if (e.etudiant.id == this.userConnected.id) {
            this.numLit = e.affectation.lit.numero;
          }
        }
        );
      },
      (error: any) => {
        // console.log(error.message);
      });
  }

  logOout(): any{
    this.authService.isLogOut();
    this.router.navigate(['/']);
  }
}
