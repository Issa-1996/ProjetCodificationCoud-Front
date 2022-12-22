export interface Campus {
    id:number;
    nom:string;
    pavillons:Pavillon[];
}
export interface Pavillon {
    id:number;
    nom:string;
    chambres:Chambre[];
}
export interface Chambre {
    id:number;
    numero:string;
    lits:Lit[];
}
export interface Lit {
    id:number;
    numero:string;
    
}