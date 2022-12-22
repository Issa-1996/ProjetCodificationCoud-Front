import { Campus, Chambre, Pavillon } from '../../Model/chambre-model';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FaculteService } from 'src/app/Service/faculte.service';
import { ExcelService } from 'src/app/Service/excel.service';
import { FormBuilder, Validators } from '@angular/forms';

export interface CampusData {
  nom: string;
  nbpavillon: number;
  nbchambre: number;
  nblit: number;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['nom', 'nbpavillon', 'nbchambre', 'nblit'];
  camps: CampusData[] = [];
  dataSource: MatTableDataSource<CampusData>;
  button = false;
  buttons = false;
  import = this.formBuilder.group({
    acceptfile: ['', Validators.required],
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pavillon: Chambre;
  chambre: Chambre;
  campus: Campus[] = [];
  nbLitTotal = 0;
  spinner = false;

  message = 'La liste a été importée avec succès.';
  showMessage = false;
  waiting = false;
  constructor(private formBuilder: FormBuilder,
              private faculteService: FaculteService,
              private exelService: ExcelService) {

  }
  ngOnInit(): void {
    this.getData()
  }

  getData(){
    this.camps = []
    this.faculteService.getCampus().subscribe(
      (data: any) => {
        this.campus = data['hydra:member'];
        this.campus.forEach(
          (campus: Campus) => {
            const cmp: CampusData = {nom: '', nbpavillon: 0, nbchambre: 0, nblit: 0};
            cmp.nom = campus.nom;
            cmp.nbpavillon = campus.pavillons.length;
            campus.pavillons.forEach(
              (pav: Pavillon) => {
                cmp.nbchambre += pav.chambres.length;
                pav.chambres.forEach(
                  (ch: Chambre) => {
                    cmp.nblit += ch.lits.length;
                  }
                );
              }
            );
            this.camps.push(cmp);
            this.dataSource = new MatTableDataSource(this.camps);
          }
        );
      }
    );

    this.faculteService.getLits().subscribe(
      (lits: any) => {
        this.nbLitTotal = lits['hydra:totalItems'];
      }
    );
  }

  ngAfterViewInit(): void {
  }
  afficher(): any {
    this.button = true;
  }
  affiche(): any {
    this.buttons = true;
  }

  envoyer(): any{
    this.showMessage = false;
    this.message = 'La liste a été importée avec succès.';
    // Formulaire vide à cet instant
    this.waiting = !this.waiting;
    const formData = new FormData();
    formData.append('excelFile', this.import.value.acceptfile._files[0]);
    this.exelService.importListChambreLit(formData).subscribe(
      (data: any[]) => {
        // tslint:disable-next-line:triple-equals
        this.getData()
        if (data.length != 0) {
          this.message = data.toString();
        }
        this.showMessage = true;
        setTimeout(()=>{
          this.showMessage = false;
        },5000)
        this.button = false;
        this.buttons = false;
        this.waiting = !this.waiting;
        this.import.reset();
      },
      (error: any)=>{
        this.message = "Une erreur est servenue!"
        this.showMessage = true;
        setTimeout(()=>{
          this.showMessage = false;
        },5000)
        this.button = false;
        this.buttons = false;
        this.waiting = false;
      });
  }
  envoyerQuota(): any{
    this.showMessage = false;
    this.message = 'La liste a été importée avec succès.';
    // Formulaire vide à cet instant
    this.waiting = !this.waiting;
    const formData = new FormData();
    formData.append('excelFile', this.import.value.acceptfile._files[0]);
    this.exelService.importListQuota(formData).subscribe(
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
        this.buttons = false;
        this.waiting = !this.waiting;
        this.import.reset();
      },
      (error: any)=>{
        console.log(error);

        this.message = "Une erreur est servenue!"
        this.showMessage = true;
        setTimeout(()=>{
          this.showMessage = false;
        },5000)
        this.button = false;
        this.buttons = false;
        this.waiting = false;
      });
  }
}

