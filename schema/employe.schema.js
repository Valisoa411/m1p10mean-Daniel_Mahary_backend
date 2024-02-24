const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  cin: { type: Number, required: true },
  genre: { type: String, required: true },
  login: { 
    type: String, 
    required: true, 
    unique: false 
  },
  mdp: { type: String, required: true },
  photo: { type: String },
  matricule: { type: String }
});

module.exports = {
    EmployeeSchema,
    EmployeeModel: mongoose.model('Employee', EmployeeSchema),
}