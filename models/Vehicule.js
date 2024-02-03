// Vehicule.js

const mongoose = require('../db/db');

const vehiculeSchema = new mongoose.Schema({
  marque: String,
  modele: String,
  annee: Number,
});

const VehiculeModel = mongoose.model('Vehicule', vehiculeSchema);

class Vehicule {
  constructor(marque=null, modele=null, annee=null) {
    this.marque = marque;
    this.modele = modele;
    this.annee = annee;
  }



  async insert() {
    const newVehicule = new VehiculeModel({ marque: this.marque, modele: this.modele, annee: this.annee });
    return newVehicule.save();
  }

  static async update(id, updatedValues) {
    return VehiculeModel.findByIdAndUpdate(id, updatedValues, { new: true });
  }

  static async delete(id) {
    return VehiculeModel.findByIdAndDelete(id);
  }

  static async getAll() {
    return VehiculeModel.find();
  }
  static async getById(id){
    return VehiculeModel.findById(id);
  }
}

module.exports = Vehicule;
