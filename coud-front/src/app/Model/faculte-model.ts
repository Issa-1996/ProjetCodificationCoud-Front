import { DepartementModel } from './departement-model';
export interface FaculteModel {
    id: number;
    nom: string;
    departement: DepartementModel [];
}
