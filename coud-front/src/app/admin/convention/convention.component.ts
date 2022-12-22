import {AfterViewInit, Component, OnInit} from '@angular/core';
import {EtudiantService} from '../../Service/etudiant.service';
import {ConventionService} from '../../Service/convention.service';
import { Router } from '@angular/router';
import { EtudiantModel } from 'src/app/Model/etudiant-model';

@Component({
  selector: 'app-convention',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.css']
})
export class ConventionComponent implements OnInit, AfterViewInit {

  constructor( private serviceEtudiant: EtudiantService,
               private convention: ConventionService,
               private router: Router) {
              }

  etudiant: EtudiantModel[];
  annee = new Date().getFullYear();
  spinner = true;

  ngAfterViewInit(): void {
    setTimeout(
      () => {
        this.spinner = false;
      }, 2500
    );

    setTimeout(
      () => {
        window.print();
      }, 3000 );
    }

  ngOnInit(): void {
    this.getConventions();
  }

  getConventions(): any {
    const niveau = localStorage.getItem('niveau');
    this.serviceEtudiant.getConvention(niveau).subscribe(
      (data) => {
        this.etudiant = data['hydra:member'];
        setTimeout(
          () => {
            this.router.navigateByUrl('/e&12t/xxa1PzTd86HNGnfdy%28dTHJH23:dg%3B/e&12t/cccc/xrty');
          }, 5000
        );
      },
      (error: any) => {
        alert('Il ya erreur de recuperation');
      }
    );
  }
}
