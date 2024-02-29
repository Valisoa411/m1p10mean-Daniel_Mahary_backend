const mongoose = require('../db/db');

const TypeDepenseSchema = new mongoose.Schema({
    label: String
})

module.exports = {
    TypeDepenseSchema,
    TypeDepenseModel: mongoose.model('TypeDepense', TypeDepenseSchema),
}