import { FaculteModel } from './faculte-model';
import {NiveauModel} from './niveau-model';
import {DepartementModel} from './departement-model';
export interface EtudiantModel {
    id: number;
    prenoms: string;
    nom: string;
    numero: string;
    username?: string;
    moyenne: number;
    dateNaissance: Date;
    lieuNaissance: string;
    faculte: FaculteModel;
    numIdentite: string;
    niveau: NiveauModel;
    departement: DepartementModel;
    archivage: boolean;
    reservation: [
        {
            annee: string;
            affectation: {
                annee? :string;
                lit: {
                    numero: string,
                    chambre: {
                        numero: string,
                        pavillon: {
                            nom: string,
                            campus: {
                                nom: string
                            }
                        }
                    }
                }
            }
        }
    ];
}
