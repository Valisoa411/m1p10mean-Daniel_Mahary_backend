const mongoose = require('../db/db');

const ClientSchema = new mongoose.Schema({
    _id: String,
    nom: String,
    prenom: String,
    email: String,
    mdp: String,
    genre: String,
    dateNaissance: String,
    etat: Number,
})

const ClientModel = mongoose.model('Client', ClientSchema);

class Client {
    constructor(
        _id=null,
        nom=null,
        prenom=null,
        email=null,
        mdp=null,
        genre=null,
        dateNaissance=null,
        etat=null,
    ) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.genre = genre;
        this.dateNaissance = dateNaissance;
        this.etat = etat;

        this._id= _id;
        this.mdp= mdp;
    }

    async insert() {
        const newClient = new ClientModel({...this})
        return newClient.save();
    }
}

module.exports = Client;