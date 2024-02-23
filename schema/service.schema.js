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

module.exports = {
    ServiceSchema,
    ServiceModel: mongoose.model('Service', ServiceSchema),
}