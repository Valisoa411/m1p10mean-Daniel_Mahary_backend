const { RendezVousModel } = require("../schema/rendezVous.schema");

class RendezVous {
    constructor (
        _id = null,
        client = null,
        service = null,
        date = null,
        employes = null,
        prixFinal = null,
        etat = null,
    ) {
        this._id = _id;
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

}

module.exports = RendezVous;