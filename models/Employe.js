const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  cin: { type: Number, required: true },
  genre: { type: String, required: true },
  login: { type: String, required: true },
  mdp: { type: String, required: true },
  photo: { type: String },
  matricule: { type : String }
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
    // Vérifier s'il y a des employés dans la collection
    const count = await EmployeeModel.countDocuments();

    // Calculer le nouveau matricule
    const newMatricule = count === 0 ? 1 : await Employe.calculateNextMatricule();

    // Ajouter le nouveau matricule à l'employé
    this.matricule = newMatricule;

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
}

module.exports =  Employe ;
