const { DepenseModel } = require("../schema/depense.schema");
const { RendezVousModel } = require("../schema/rendezVous.schema");
const ObjectId = require('mongoose').Types.ObjectId;
const { NotificationModel } = require("../schema/notification.schema");
const { RendezVousModel } = require("../schema/rendezVous.schema");
const { formatDate } = require("../util/util");

class RendezVous {
    constructor (
        client = null,
        service = null,
        date = null,
        employes = null,
        prixFinal = null,
        etat = null,
    ) {
        this.client = client;
        this.service = service;
        this.date = date;
        this.employes = employes;
        this.prixFinal = prixFinal;
        this.etat = etat;
    }

    async insert() {
        const newRendezVousMongoose = new RendezVousModel({...this});
        const dateRappel = new Date(this.date);
        dateRappel.setHours(dateRappel.getHours() - 1);
        const notification = {
            type: 'rappel',
            target: this.client._id,
            titre: 'Rappel de Rendez-Vous',
            text: `Vous avez un rendez-vous pour un ${this.service.nom} le ${formatDate(this.date)}`,
            lien: '/client/accueil',
            dateNotification: dateRappel,
            checked: false,
        }
        await NotificationModel.insertOne(notification);
        return await newRendezVousMongoose.save();
    }

    static async getAll() {
        return await RendezVousModel.find();
    }

    static async getById(id) {
        const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id)
                }
            }
        ];
    
        const service = await RendezVousModel.aggregate(pipeline);
    
        // Remarque : la méthode aggregate renvoie toujours un tableau,
        // alors vous pouvez accéder au premier élément du tableau si nécessaire.
        console.log(service[0]);
    
        return service[0];
    }
    static async update(id, updatedData) {
        return await RendezVousModel.findByIdAndUpdate(id, updatedData, { new: true });
    }

    static async byDate(year,month){
        const result = await RendezVousModel.aggregate([
            {
              $match: {
                date: {
                  $gte: new Date(`${year}-${month}-01`),
                  $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
                },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id': 1 } }, // Tri par jour croissant
          ]);
        return result;
    }
    static async byMonth(year){
        const result = await RendezVousModel.aggregate([
            {
              $match: {
                date: {
                  $gte: new Date(`${year}-01-01`),
                  $lt: new Date(`${parseInt(year) + 1}-01-01`),
                },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id': 1 } }, // Tri par mois croissant
          ]);
        return result;
    }

    static async byDateChiffreAffaire(year, month) {
        const result = await RendezVousModel.aggregate([
          {
            $match: {
              date: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
              },
              etat:"Effectué"
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
              chiffreAffaire: { $sum: '$prixFinal' },
            },
          },
          { $sort: { '_id': 1 } },
        ]);
        return result;
      }

      static async byMonthChiffreAffaire(year) {
        const result = await RendezVousModel.aggregate([
          {
            $match: {
              date: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${parseInt(year) + 1}-01-01`),
              },
              etat:"Effectué"
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
              chiffreAffaire: { $sum: '$prixFinal' },
            },
          },
          { $sort: { '_id': 1 } },
        ]);
        return result;
      }
      static comparerMois(anneeMois1) {
        // Ajouter un zéro devant le mois si nécessaire
        const mois1 = anneeMois1.split('-')[1].padStart(2, '0');
        
        // Comparer les chaînes de caractères des mois
        return mois1;
      }
      static async beneficesParMois(year) {
        // Obtenez les chiffres d'affaires par mois
        const chiffresAffaires = await RendezVousModel.aggregate([
          {
            $match: {
              date: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${parseInt(year) + 1}-01-01`),
              },
              etat: "Effectué"
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
              chiffreAffaire: { $sum: '$prixFinal' },
            },
          },
          { $sort: { '_id': 1 } },
        ]);

        console.log("chiffresAffaires");
        console.log(chiffresAffaires);
      
        // Obtenez les dépenses par mois
        const anne=parseInt(year);
        const depenses = await DepenseModel.aggregate([
            {
              $match: {
                annee: anne // Filtrer par année
              }
            },
            {
              $group: {
                _id: '$mois', // Regrouper par mois
                depense: { $sum: '$montant' } // Calculer la somme des dépenses pour chaque mois
              }
            },
            {
              $project: {
                _id: 0, // Exclure le champ _id du résultat final si vous le souhaitez
                mois: '$_id',
                depense: 1
              }
            }
        ]);

        console.log("depenses");
        console.log(depenses);
      
        // Créez un objet pour stocker les bénéfices par mois
        const beneficesParMois = {};
        const tabBenefices=[];

        chiffresAffaires.forEach(chiffre => {
            const mois = chiffre._id;
            const chiffreAffaire = chiffre.chiffreAffaire;
            const totalDepenses = depenses.find(depense => depense.mois === parseInt(RendezVous.comparerMois(mois)))?.depense || 0;
          
            beneficesParMois["_id"]=mois;
            beneficesParMois["benefice"] = chiffreAffaire - totalDepenses;
            tabBenefices.push(beneficesParMois);
          });
      
        return tabBenefices;
      }
    //   const result = await RendezVousModel.aggregate([
    //     {
    //       $match: {
    //         date: {
    //           $gte: new Date(`${year}-01-01`),
    //           $lt: new Date(`${parseInt(year) + 1}-01-01`),
    //         },
    //         etat: "Effectué"
    //       },
    //     },
    //     {
    //       $addFields: {
    //         commissionAmount: { $multiply: ['$prixFinal', { $divide: ['$service.commission', 100] }] }
    //       }
    //     },
    //     {
    //       $group: {
    //         _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
    //         totalAmount: { $sum: '$prixFinal' },
    //         totalNet: { $sum: { $subtract: ['$prixFinal', '$commissionAmount'] } }
    //       },
    //     },
    //     { $sort: { '_id': 1 } },
    //   ]);
    //   return result;

    

}

module.exports = RendezVous;