const { mongoose } = require("../db/db");
const { ServiceSchema } = require("./service.schema");

const OffreSpecialSchema = new mongoose.Schema({
    nom: String,
    service: ServiceSchema,
    reduction: Number,
    dateDebut: Date,
    dateFin: Date,
})

module.exports = {
    OffreSpecialSchema,
    OffreSpecialModel: mongoose.model('OffreSpecial', OffreSpecialSchema),
}