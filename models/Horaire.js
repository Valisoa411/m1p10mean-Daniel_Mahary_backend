const mongoose = require('../db/db');
const { parseTimeStringToDate } = require('../util/util');

const HoraireSchema = new mongoose.Schema({
    idEmploye: String,
    jour: Number,
    debut: String,
    fin: String,
})

const HoraireModel = mongoose.model('Horaire', HoraireSchema);

class Horaire {
    constructor(
        idEmploye = null,
        jour = null,
        debut = null,
        fin = null,
    ) {
        this.idEmploye = idEmploye;
        this.jour = jour;
        this.debut = debut;
        this.fin = fin;
    }

    async insert() {
        const newHoraireMongoose = new HoraireModel({ ...this });
        return await newHoraireMongoose.save();
    }

    async getAll() {
        const horaires = await HoraireModel.find().exec();
        return horaires;
    }

    async getById() {
        const horaire = await HoraireModel.findById(this._id).exec();
        return horaire;
    }

    async update() {
        await HoraireModel.findByIdAndUpdate(this._id, { ...this });
    }

    async delete() {
        await HoraireModel.findByIdAndDelete(this._id);
    }
}

module.exports = Horaire;