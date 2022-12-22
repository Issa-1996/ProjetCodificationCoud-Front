import { InterceptorServiceInterceptor } from './Service/interceptor-service.interceptor';
import { AuthService } from './Service/auth-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './Material/matmodule.service';
import { ExcelService } from './Service/excel.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListeComponent } from './etudiant/liste/liste.component';
import { CodifierComponent } from './etudiant/codifier/codifier.component';
import { RegisterComponent } from './etudiant/register/register.component';
import {MatSortModule} from '@angular/material/sort';
import { AccueilComponent } from './admin/accueil/accueil.component';
import { ReservationEtudiantComponent } from './admin/reservation-etudiant/reservation-etudiant.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtHelperService, JWT_OPTIONS} from '@auth0/angular-jwt';
import { ResultatComponent } from './etudiant/resultat/resultat.component';
import { InscriptionComponent } from './admin/inscription/inscription.component';
import { HeaderComponent } from './header/header.component';
import { ContainerComponent } from './container/container.component';
import { PaginationComponent } from './public/pagination/pagination.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './parametres/custom-mat-paginator-intl.service';
import { ConventionComponent } from './admin/convention/convention.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListeComponent,
    CodifierComponent,
    RegisterComponent,
    AccueilComponent,
    ReservationEtudiantComponent,
    ResultatComponent,
    InscriptionComponent,
    HeaderComponent,
    ContainerComponent,
    PaginationComponent,
    ConventionComponent,
    NotFoundComponent
  ],
    imports: [
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
  providers: [
    ExcelService,
    AuthService,
    JwtHelperService,
    InterceptorServiceInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorServiceInterceptor,
      multi: true
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
