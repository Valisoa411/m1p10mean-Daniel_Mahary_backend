const mongoose = require('../db/db');

const EmployeSchema = new mongoose.Schema({
    nom: String,
})

const EmployeModel = mongoose.model('Employe', EmployeSchema);

class Employe {
    constructor(
        nom = null,
    ) {
        this.nom = nom;
    }

    async insert() {
        const newEmployeMongoose = new EmployeModel({...this});
        return await newEmployeMongoose.save();
    }

    async getById() {
        const employe = await EmployeModel.findById(this._id).exec();
        return employe;
    }
}

module.exports = Employe;