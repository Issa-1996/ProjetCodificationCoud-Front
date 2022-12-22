import { DepartementModel } from './departement-model';
export interface NiveauModel {
    id: number;
    nom: string;
    departement: DepartementModel;
}
