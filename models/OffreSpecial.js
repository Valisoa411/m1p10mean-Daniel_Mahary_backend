const { ClientModel } = require("../schema/client.schema")
const { NotificationModel } = require("../schema/notification.schema")
const { OffreSpecialModel } = require("../schema/offreSpecial.schema")
const { getSimpleDate } = require("../util/util")
const Service = require("./Service")

class OffreSpecial {
    constructor(
        nom = null,
        service = null,
        reduction = null,
        dateDebut = null,
        dateFin = null,
    ) {
        this.nom = nom
        this.service = service
        this.reduction = reduction
        this.dateDebut = dateDebut
        this.dateFin = dateFin
    }

    static calculPrixFinal(prixInitial, offres) {
        let totalReduction = 0
        offres.forEach(offre => {
            totalReduction += offre.reduction ? offre.reduction : 0;
        })
        return prixInitial * (100-totalReduction) / 100;
    }

    static async putOffreInList(list) {
        const now = getSimpleDate(new Date());
        const listTmp = [];
        for (const element of list) {
            const service = new Service();
            service._id = element._id;
            const offres = await service.getAffectingOffre(now);
            listTmp.push({
                ...element,
                prixFinal: OffreSpecial.calculPrixFinal(element.prix, offres),
            });
        }
        return listTmp;
    }

    async insert() {
        const newOffreSpecialMongoose = new OffreSpecialModel({ ...this })
        const clientIds = await ClientModel.find({ etat: 1 }, '_id').exec();
        const notifications = [];
        clientIds.forEach(clientId => {
            notifications.push({
                type: 'offre',
                target: clientId._id,
                titre: this.nom,
                text: `Réduction de ${this.reduction} sur ${this.service.nom}`,
                lien: '/client/accueil',
                dateNotification: new Date(),
                checked: false,
            })
        })
        await NotificationModel.insertMany(notifications);
        return await newOffreSpecialMongoose.save();
    }

    async getAll() {
        const offreSpecials = await OffreSpecialModel.find().exec();
        return offreSpecials;
    }

    async getById() {
        const offreSpecial = await OffreSpecialModel.findById(this._id).exec();
        return offreSpecial;
    }

    async update() {
        await OffreSpecialModel.findByIdAndUpdate(this._id, { ...this });
    }

    async delete() {
        await OffreSpecialModel.findByIdAndDelete(this._id);
    }
}

module.exports = OffreSpecial;