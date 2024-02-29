const { NotificationModel } = require("../schema/notification.schema");
const { RendezVousModel } = require("../schema/rendezVous.schema");
const { formatDate } = require("../util/util");

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

}

module.exports = RendezVous;