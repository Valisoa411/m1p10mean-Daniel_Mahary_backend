const mongoose = require('../db/db');

const ClientSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mdp: String,
    genre: String,
    dateNaissance: Date,
    etat: Number,
    dateInscription: Date
})

module.exports = {
    ClientSchema,
    ClientModel: mongoose.model('Client', ClientSchema),
};