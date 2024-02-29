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

  static async searchElastic(term,page=1,limit=5) {
    const skip = (page - 1) * limit;
    const searchQuery = {
      $or: [
        { nom: { $regex: new RegExp(term, 'i') } }, // Recherche insensible à la casse pour le nom
        { prenom: { $regex: new RegExp(term, 'i') } }, // Recherche insensible à la casse pour le prénom
        { matricule: term },
        { login: { $regex: new RegExp(term, 'i') }} // Recherche exacte pour le matricule
      ]
    };

    const listeEmploye = await EmployeeModel.find(searchQuery).skip(skip).limit(limit);
    const totalItems= await EmployeeModel.countDocuments(searchQuery);
    return {listeEmploye,totalItems};
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



  static async getAllEmployees(page=1,limit=5) {
    const skip = (page - 1) * limit;
    const listeEmploye=await EmployeeModel.find().skip(skip)
    .limit(limit);
    const totalItems=await EmployeeModel.countDocuments();
    return {listeEmploye,totalItems};
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
  static async getRendezVous(id,page=1,limit=5) {
    const skip = (page - 1) * limit;
    // Utilisez l'ID de l'employé pour récupérer les rendez-vous associés
    const listeRdv=await RendezVousModel.find({ "employes._id": { $in: [id] } }).skip(skip).limit(limit);
    const totalItems=await  RendezVousModel.countDocuments({ "employes._id": { $in: [id] } });
    return {listeRdv,totalItems};
  }
  static async getRendezVousBetweenDates(id, startDateString, endDateString,page=1,limit=5) {
    const skip = (page - 1) * limit;
    const startDate = new Date(startDateString);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateString);
    endDate.setHours(23, 59, 59, 999);
  
    // Utilisez l'ID de l'employé et les dates pour récupérer les rendez-vous associés
    const listeRdv= await RendezVousModel.find({
      "employes._id": { $in: [id] },
      date: { $gte: startDate, $lte: endDate }
    }).skip(skip).limit(limit);
    const totalItems=await  RendezVousModel.countDocuments({
      "employes._id": { $in: [id] },
      date: { $gte: startDate, $lte: endDate }
    });
    return {listeRdv,totalItems};
  }
  static async getRendezVousForDate(id, dateString,page=1,limit=5) {
    const skip = (page - 1) * limit;
    const dateToSearch = new Date(dateString);
  
    // Utilisez l'ID de l'employé et la date pour récupérer les rendez-vous associés
    const startDate = new Date(dateToSearch);
    startDate.setHours(0, 0, 0, 0); // Date de début à 00:00:00

    const endDate = new Date(dateToSearch);
    endDate.setHours(23, 59, 59, 999); // Date de fin à 23:59:59.999

    // Utilisez l'ID de l'employé et la plage de temps pour récupérer les rendez-vous associés
    const listeRdv= await RendezVousModel.find({
      "employes._id": { $in: [id] },
      date: { $gte: startDate, $lte: endDate }
    }).skip(skip).limit(limit);
    const totalItems=await  RendezVousModel.countDocuments({
      "employes._id": { $in: [id] },
      date: { $gte: startDate, $lte: endDate }
    });
    return {listeRdv,totalItems};
  }
  static async  calculateDailyCommission(employeeId, date) {
    try {
        const dateToSearch = new Date(date);

        // Utilisez l'ID de l'employé et la date pour récupérer les rendez-vous associés
        const startDate = new Date(dateToSearch);
        startDate.setHours(0, 0, 0, 0); // Date de début à 00:00:00

        const endDate = new Date(dateToSearch);
        endDate.setHours(23, 59, 59, 999); // Date de fin à 23:59:59.999

        const rendezVousList = await RendezVousModel.find({
            "employes._id": employeeId,
            date: { $gte: startDate, $lte: endDate },
            etat: "Effectué"
        });

        let totalCommission = 0;

        rendezVousList.forEach((rendezVous) => {
            const serviceCommissionPercentage = rendezVous.service.commission;
            const prixFinal = rendezVous.prixFinal;

            // Calculez la commission pour ce rendez-vous
            const commission = (serviceCommissionPercentage / 100) * prixFinal;

            // Ajoutez la commission au total
            totalCommission += commission;
        });

        return totalCommission;
    } catch (error) {
        throw new Error("Erreur lors du calcul de la commission quotidienne : " + error.message);
    }
  }
  static async getMoyenneHeureDetravail(idemploye){
      const pipeline = [
        {
          $match: {
            "employes._id": { $in: [idemploye] },
            "etat": "Effectué"
          }
        },
        {
          $group: {
            _id: null,
            totalDuration: { $sum: "$service.duree" },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            moyenne: { $divide: ["$totalDuration", { $multiply: ["$count", 60] }] }
          }
        }
      ];

      const result = await RendezVousModel.aggregate(pipeline);

      const moyenne = result.length > 0 ? result[0].moyenne : 0;
      return moyenne;
  }
  
}

module.exports = Employe;
