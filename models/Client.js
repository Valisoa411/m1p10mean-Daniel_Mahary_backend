const bcrypt = require('bcrypt');
const mongoose = require('../db/db');

const ClientSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mdp: String,
    genre: String,
    dateNaissance: Date,
    etat: Number,
})

const ClientModel = mongoose.model('Client', ClientSchema);

class Client {
    constructor(
        nom = null,
        prenom = null,
        email = null,
        mdp = null,
        genre = null,
        dateNaissance = null,
        etat = null,
    ) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.mdp = mdp;
        this.genre = genre;
        this.etat = etat;

        this.setDateNaissance(dateNaissance)
    }

    setDateNaissance(value) {
        if (value instanceof Date) {
            this.dateNaissance = value;
        } else {
            try {
                this.dateNaissance = new Date(value);
            } catch (error) {
                throw new Error('Date de naissance invalid');
            }
        }
        if (this.dateNaissance.getTime() > new Date().getTime()) {
            this.dateNaissance = null;
            throw new Error('Date de naissance doit être antérieure à la date actuelle');
        }
    }

    async insert() {
        if (this.mdp.length < 8) throw new Error('"Le mot de passe doit contenir 8 charactères')
        const client = await ClientModel.findOne({ email: this.email })
        if (client) throw new Error('Email déja utilisé')

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        this.mdp = bcrypt.hashSync(this.mdp, salt);
        const newClient = new ClientModel({ ...this })
        return await newClient.save();
    }
}

module.exports = Client;