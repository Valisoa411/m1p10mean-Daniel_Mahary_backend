const mongoose = require('../db/db');

const HoraireSchema = new mongoose.Schema({
    idEmploye: String,
    jour: Number,
    debut: String,
    fin: String,
})

module.exports = {
    HoraireSchema,
    HoraireModel: mongoose.model('Horaire', HoraireSchema),
};