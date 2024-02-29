const mongoose = require('../db/db');
const { TypeDepenseSchema } = require('./typeDepense.schema');

const DepenseSchema = new mongoose.Schema({
    typedepense: TypeDepenseSchema,
    mois: Number,
    montant: Number,
    annee: Number
})

module.exports = {
    DepenseSchema,
    DepenseModel: mongoose.model('Depense', DepenseSchema),
}