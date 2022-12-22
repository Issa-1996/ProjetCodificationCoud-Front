import { ContainerComponent } from './container/container.component';
import { InscriptionComponent } from './admin/inscription/inscription.component';
import { AdminGuardGuard } from './admin-guard.guard';
import { AuthGuardGuard } from './auth-guard.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodifierComponent } from './etudiant/codifier/codifier.component';
import { ListeComponent } from './etudiant/liste/liste.component';
import { RegisterComponent } from './etudiant/register/register.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './admin/accueil/accueil.component';
import { ReservationEtudiantComponent } from './admin/reservation-etudiant/reservation-etudiant.component';
import { ResultatComponent } from './etudiant/resultat/resultat.component';
import { EtudiantGuardGuard } from './etudiant-guard.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import {GuardResultGuard} from './guard-result.guard';
import {ListGuard} from './list.guard';
import {ConventionComponent} from './admin/convention/convention.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {path: 'inscription', component: RegisterComponent },
  {path: 'e&12t/xxa1PzTd86HNGnfdy(dTHJH23:dg;', component: ContainerComponent, canActivate: [AuthGuardGuard],
    children: [
    {path: 'e&12t/llla/1PzT', component: ListeComponent, canActivate: [AuthGuardGuard, EtudiantGuardGuard, GuardResultGuard] },
    {path: 'e&12t/rrr/xa1zT', component: ReservationEtudiantComponent, canActivate: [AuthGuardGuard, AdminGuardGuard] },
    {path: 'e&12t/cccc/xrty', component: CodifierComponent, canActivate: [AuthGuardGuard, AdminGuardGuard]},
    {path: 'e&12t/aaa/xaru', component: AccueilComponent, canActivate: [AuthGuardGuard, AdminGuardGuard]},
    {path: 'e&12t/rere/hurg', component: ResultatComponent, canActivate: [AuthGuardGuard, EtudiantGuardGuard, ListGuard]},
      {path: 'e&12t/coco/curt', component: ConventionComponent},
    {path: 'e&12t/adad/yt1T', component: InscriptionComponent, canActivate: [AuthGuardGuard, AdminGuardGuard]},
  ]},
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
