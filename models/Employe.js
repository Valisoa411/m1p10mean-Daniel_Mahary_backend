const { EmployeeModel } = require('../schema/employe.schema');
const { HoraireModel } = require('../schema/horaire.schema');
const bcrypt= require("bcrypt");
const { RendezVousModel } = require('../schema/rendezVous.schema');

class Employe {
  constructor(nom = null, prenom = null, cin = null, genre = null, login = null, mdp = null, photo = null) {
    this.nom = nom;
    this.prenom = prenom;
    this.cin = cin;
    this.genre = genre;
    this.login = login;
    this.mdp = mdp;
    this.photo = photo;
  }

  static async getHoraires(id) {
    const horaires = await HoraireModel.find({ idEmploye: id })
      .sort({ jour: 1, debut: 1 }) // Sort by jour in ascending order, then debut in ascending order
      .exec();
    return horaires;
  }

  async insert() {
    // Vérifier s'il y a des employés dans la collection
    const count = await EmployeeModel.countDocuments();

    // Calculer le nouveau matricule
    const newMatricule = count === 0 ? 1 : await Employe.calculateNextMatricule();

    // Ajouter le nouveau matricule à l'employé
    this.matricule = newMatricule;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    this.mdp = bcrypt.hashSync(this.mdp, salt);

    // Créer et enregistrer l'employé
    const employee = new EmployeeModel({ ...this });
    return await employee.save();

  }

  static async searchElastic(term) {
    const searchQuery = {
      $or: [
        { nom: { $regex: new RegExp(term, 'i') } }, // Recherche insensible à la casse pour le nom
        { prenom: { $regex: new RegExp(term, 'i') } }, // Recherche insensible à la casse pour le prénom
        { matricule: term },
        { login: { $regex: new RegExp(term, 'i') }} // Recherche exacte pour le matricule
      ]
    };

    return await EmployeeModel.find(searchQuery);
  }

  static async getByEmail(emaile){
      return EmployeeModel.findOne({login: emaile});
  }

  static async getById(id){
    return EmployeeModel.findById(id);
}

  // Méthode pour calculer le matricule suivant en fonction du maximum actuel
  static async calculateNextMatricule() {
    const maxMatriculeEmployee = await EmployeeModel
      .findOne({}, { matricule: 1 })
      .sort({ matricule: -1 }); // Trier par ordre décroissant pour obtenir le maximum

    // Si aucun employé n'est présent, commencer à partir de 1
    return maxMatriculeEmployee ? parseInt(maxMatriculeEmployee.matricule) + 1 : 1;
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
  static async getRendezVous(id) {
    // Utilisez l'ID de l'employé pour récupérer les rendez-vous associés
    return await RendezVousModel.find({ employes: { $in: [id] } });
  }
}

module.exports = Employe;
