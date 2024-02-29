const { DepenseModel } = require("../schema/depense.schema");
const ObjectId = require('mongoose').Types.ObjectId;
class Depense{
    constructor(
        typedepense = null,
        mois = null,
        montant = null,
        annee=null
    )
    {
        this.typedepense=typedepense;
        this.mois=mois;
        this.montant=montant;
        this.annee=annee;
    }
    async insert() {
        const newDepenseMongoose = new DepenseModel({...this});
        return await newDepenseMongoose.save();
    }
    static async deleteDepense(id) {
        return await DepenseModel.findByIdAndDelete(id);
    }
    static async getAll() {
        return await DepenseModel.find();
    }
}

module.exports = Depense;