const mongoose = require('../db/db');
const { ClientSchema } = require('./client.schema');
const { EmployeeSchema } = require('./employe.schema');
const { ServiceSchema } = require('./service.schema');

const RendezVousSchema = new mongoose.Schema({
    _id: String,
    client: ClientSchema,
    service: ServiceSchema,
    date: Date,
    employes: [EmployeeSchema],
    prixFinal: Number,
    etat: String,
})

module.exports = {
    RendezVousSchema,
    RendezVousModel: mongoose.model('RendezVous', RendezVousSchema),
}