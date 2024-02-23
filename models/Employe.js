const mongoose = require('mongoose');
const { HoraireModel } = require('../schema/horaire.schema');

const employeeSchema = new mongoose.Schema({
  _id: { type: String },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  cin: { type: Number, required: true },
  genre: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  mdp: { type: String, required: true },
  photo: { type: String }
});

const EmployeeModel = mongoose.model('Employee', employeeSchema);

class Employe {
  constructor(_id = null, nom = null, prenom = null, cin = null, genre = null, login = null, mdp = null, photo = null) {
    this._id = _id;
    this.nom = nom;
    this.prenom = prenom;
    this.cin = cin;
    this.genre = genre;
    this.login = login;
    this.mdp = mdp;
    this.photo = photo;
  }

  async getHoraires() {
    const horaires = await HoraireModel.find({ idEmploye: this._id })
      .sort({ jour: 1, debut: 1 }) // Sort by jour in ascending order, then debut in ascending order
      .exec();
    return horaires;
  }

  async insert() {
    const employee = new EmployeeModel({ ...this });
    return await employee.save();
  }

  static async getAllEmployees() {
    return await EmployeeModel.find();
  }

  static async getEmployeeById(id) {
    return await EmployeeModel.findById(id);
  }

  static async updateEmployee(id, updatedData) {
    return await EmployeeModel.findByIdAndUpdate(id, updatedData, { new: true });
  }

  static async deleteEmployee(id) {
    return await EmployeeModel.findByIdAndDelete(id);
  }
}

module.exports = Employe;
