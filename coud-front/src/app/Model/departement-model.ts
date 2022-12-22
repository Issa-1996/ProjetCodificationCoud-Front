import { FaculteModel } from './faculte-model';
import { NiveauModel } from './niveau-model';
export interface DepartementModel {
    id: number;
    nom: string;
    faculte: FaculteModel;
    niveau: NiveauModel [];
}
