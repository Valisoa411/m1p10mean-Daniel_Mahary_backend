const mongoose = require('../db/db');

const ServiceSchema = new mongoose.Schema({
    nom: String,
    prix: Number,
    duree: Number,
    commission: Number,
    description: String,
    photo: String,
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
    ) {
        this.nom = nom;
        this.prix = prix;
        this.duree = duree;
        this.commission = commission;
        this.description = description;
        this.photo = photo;
    }

    async insert() {
        try {
            const newServiceMongoose = new ServiceModel({ ...this })
            return await newServiceMongoose.save();
        }
        catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            const services = await ServiceModel.find().exec();
            return services;
        } catch (error) {
            throw error;
        }
    }

    async getById() {
        try {
            const service = await ServiceModel.findById(this._id).exec();
            return service;
        } catch (error) {
            throw error;
        }
    }
    
    async update() {
        try {
            await ServiceModel.findByIdAndUpdate(this._id, {...this});
        } catch (error) {
            throw error;
        }
    }
    
    async delete() {
        try {
            await ServiceModel.findByIdAndDelete(this._id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Service;