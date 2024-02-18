const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
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
  constructor(nom=null, prenom=null, cin=null, genre=null, login=null, mdp=null, photo=null) {
    this.nom = nom;
    this.prenom = prenom;
    this.cin = cin;
    this.genre=genre;
    this.login = login;
    this.mdp = mdp;
    this.photo = photo;
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

module.exports =  Employe ;
