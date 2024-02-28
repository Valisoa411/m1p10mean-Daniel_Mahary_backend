const { RendezVousModel } = require("../schema/rendezVous.schema");
const ObjectId = require('mongoose').Types.ObjectId;

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

    

}

module.exports = RendezVous;