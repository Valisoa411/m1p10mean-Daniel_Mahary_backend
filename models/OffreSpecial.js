const { OffreSpecialModel } = require("../schema/offreSpecial.schema")

class OffreSpecial {
    constructor(
        nom = null,
        service = null,
        reduction = null,
        dateDebut = null,
        dateFin = null,
    ){
        this.nom = nom
        this.service = service
        this.reduction = reduction
        this.dateDebut = dateDebut
        this.dateFin = dateFin
    }

    async insert() {
        const newOffreSpecialMongoose = new OffreSpecialModel({ ...this })
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