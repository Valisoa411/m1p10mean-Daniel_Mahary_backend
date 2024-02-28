const mongoose = require("../db/db");

const PreferenceSchema = new mongoose.Schema({
    idClient: String,
    idObject: String,
    type: String,
    ordre: Number,
})

module.exports = {
    PreferenceSchema,
    PreferenceModel: mongoose.model('Preference', PreferenceSchema),
}