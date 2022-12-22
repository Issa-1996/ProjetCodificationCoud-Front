import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { EtudiantModel } from '../Model/etudiant-model';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ConventionService {

  constructor() { }
  public annee = new Date().getFullYear();
  public anneeToStr = new Date().getFullYear().toString();
  
  genererConvention(etudiant: EtudiantModel): any{
    const res: any[] = etudiant.reservation.filter(
      (r)=> r.annee == this.anneeToStr
    );
  
    const dd = {
      content: [
        {
         alignment: 'justify',
          columns: [
            {
              width: 400,
              fontSize: 10,
              text: 'Ministére de l\'Enseignement \n\n Supérieur et de la Recherche,\n\n CENTRE DES OEUVRES UNIVERSITAIRES DE DAKAR'
            },
            {
              table: {
                width: 400,
                body: [
                  [
                    {
                      border: [true, true, true, true],
                      fontSize: 10,
                      // float: 'right',
                      margin: [0, 5, 0, 5],
                      text: `N° Chambre : ${res[0].affectation.lit.chambre.numero}\n\n Pavillon: ${res[0].affectation.lit.chambre.pavillon.nom}\n\n Campus: ${res[0].affectation.lit.chambre.pavillon.campus.nom}\n\n Caution:.........................\n\n Taux/Mois.....................`
                    }
                  ]
                ]
              }
            }
          ],
        },
        {
          columns: [
            {
              fontSize: 14, bold: true,
              text: 'N°: ______________\n\n'
            }
          ]
        },
        {
          columns: [
            {width: 110, text: ''},
            {
              table:
                {
                  body: [
                    [
                      {
                        text: 'CONVENTION D\'HÉBERGEMENT', style: 'header',
                        border: [true, true, true, true],
                      },
                    ]
                  ]
                }
            },
            {width: 80, text: ''},
          ]
        },
        {
          text: `ANNEE UNIVERSITAIRE: ${this.annee - 1}/${this.annee} `, style: 'certify'
        },
        {
          columns: [
            {
              fontSize: 10,
              text: `Prénom: ${etudiant.prenoms}`
            },
            {
              fontSize: 10,
              text: `Nom: ${etudiant.nom}\n\n`
            },

          ]
        },
        {
          columns: [
            {
              fontSize: 10,
              text: `Date de naissance: ${etudiant.dateNaissance}`
            },
            {
              fontSize: 10,
              text: `Lieu de naissance: ${etudiant.lieuNaissance}\n\n`
            }
          ]
        },
        {
          columns: [
            {
              fontSize: 10,
              text: `Nationalité:................................................. `
            },
            {
              fontSize: 10,
              text: 'Bourse: ...................................................\n\n'
            }
          ]
        },
        {
          columns: [
            {
              fontSize: 10,
              text: `Faculté: ${etudiant.niveau.departement.nom}`
            },
            {
              fontSize: 10,
              text: `Niveau: ${etudiant.niveau.nom}\n\n`
            }
          ]
        },
        {
          columns: [
            {
              fontSize: 10,
              text: `N° Catre COUD:................................. `
            },
            {
              fontSize: 10,
              text: `N° CE: ${etudiant.username}\n\n`
            }
          ]
        },
        {
          columns: [
            {
              fontSize: 10,
              text: 'Bénéficie de l\'hébergement: ......................................................................................\n\n'
            }
          ]
        },
        {
          columns: [
            {width: 150, text: ''},
            {
              table:
                {
                body: [
                  [
                    {
                      text: 'EXTRAIT DU RÉGLEMENT INTÉRIEUR',
                      border: [true, true, true, false],
                    },
                  ]
                ]
              }
            },
            {width: 80, text: ''},
          ]
        },
        {
          table: {
          body: [
              [
                {
                  fontsize: 10,
                  border: [true, true, true, true],
                  text: ' Article 16 \n' +
                    '1- Le président doit à son installation, vérifier et signer l\'invention du mobillier et de la literie de la' +
                    'chambre qui lui est attribuée et dont il est entiérement ressponsable\n' +
                    '2- Toute entrée ou toute sortie de mobilier personnel doit être autorisée par le service de l\'accueil et du' +
                    'logement en rapport avec la comptabilité des Matiéres\n' +
                    '3- Le locataire ne peut:\n' +
                    ' \t * ni héberger un autre étudiant, même bénéficiaire des Oeuvres \n' +
                    '  * ni sous -louer son lit ou sa sa chambre\n' +
                    '  * ni céder son lit ou sa chambre\n' +
                    '4- Toute forme de commerce est interdit dans les chambres\n' +
                    'Article 17 \n' +
                    'Il est formellement interdite de recevoir des visites susceptibles de troubler l\'ordre et la bonne renommée de la cité\n' +
                    'Article 18:(Alinéa 3)\n' +
                    'L\'installation des appareils électoménagers ou audiovisuels n\'est autorisée. Toute violation de l\'une des dispositions' +
                    'de ces articles sera sanctionée par l\'exécution du contrevenant \n' +
                    'N.B: tout étudiant attributaire d\'un lit dispose d\'un delai maximum de 07 jours , à compter de la ' +
                    'rentrée accadémique de l\'établissement dont il reléve , afin d\'effectuer les formalités requises pour ' +
                    'l\'hébergement. Le loyer est dû à partir de cette, passée ce délai , le lit est réaffecté sans prévis'

                },

              ]
            ]
          }
        },
        {
          columns: [
            {
              fontsize: 10,
              margin: [0, 5, 0, 0],
              text: `Dakar, Le.......................20......`, alignment: 'right',
            }
          ]
        },
        {
          columns: [
            {
              fontsize: 10,
              width: 300,
              text: 'Pour le Directeur du COUD \n' +
                'Le Chef du Service de l\'hébergement'
            },
            {
              fontsize: 10,
              text: 'Lu et Approuvé\n Le Locataire'
            }
          ]
        }
      ],
      styles: {
        header: {
          width: 100,
          fontSize: 20,
          bold: true,
          italics: true,
          border: [true, true, true, true],
          alignment: 'center'
        },
        certify: {
          margin: [0, 5, 0, 5],
          alignment: 'center',
        }
      },
    };
    pdfMake.createPdf(dd).print();
  }
}
