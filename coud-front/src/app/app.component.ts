import { EtudiantService } from './Service/etudiant.service';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'coud-front';

  constructor(private etudiantService: EtudiantService, private helper: JwtHelperService){}

  etudiants: any[] = []

  nbre=0;

  ngOnInit(): void {
    
    //60000ms * 10mn
    // interval(6000000000000).subscribe(
    //   ()=>{
    //     const token = localStorage.getItem('token');
    //     if (token && !this.helper.isTokenExpired(token)) {
    //       //Api du web service
    //       this.etudiantService.readApiEtudiant().subscribe(
    //         (data)=>{this.etudiants = data; console.log(data)}
    //       )
    //       if (this.etudiants.length != 0) {
    //         this.etudiants.forEach(
    //           (etu: any)=>{
    //             this.etudiantService.postEtudiantApi(etu).subscribe(
    //               ()=>{
    //                 console.log(++this.nbre)
    //               }
    //             )
    //           }
    //         )
    //       }
    //     }
    //   }
    // ) 
  }
}
