const mongoose = require('../db/db');

const ServiceSchema = new mongoose.Schema({
    nom: String,
    prix: Number,
    duree: Number,
    commission: Number,
    description: String,
    photo: String,
    nbEmploye: Number,
})

const ServiceModel = mongoose.model('Service', ServiceSchema);

class Service {
    constructor(
        nom = null,
        prix = null,
        duree = null,
        commission = null,
        description = null,
        photo = null,
        nbEmploye = null,
    ) {
        this.nom = nom;
        this.prix = prix;
        this.duree = duree;
        this.commission = commission;
        this.description = description;
        this.photo = photo;
        this.nbEmploye = nbEmploye;
    }

    async freeHoraireOfDay(selectedDate) {
        const query = {
            date: selectedDate
        }
        const someRendezVous = RendezVousModel.find(query).exec();
        
    }


    async insert() {
        const newServiceMongoose = new ServiceModel({ ...this })
        return await newServiceMongoose.save();
    }

    async getAll() {
        const services = await ServiceModel.find().exec();
        return services;
    }

    async getById() {
        const service = await ServiceModel.findById(this._id).exec();
        return service;
    }

    async update() {
        await ServiceModel.findByIdAndUpdate(this._id, { ...this });
    }

    async delete() {
        await ServiceModel.findByIdAndDelete(this._id);
    }
}

module.exports = Service;