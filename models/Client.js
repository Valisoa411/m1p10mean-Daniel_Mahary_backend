const bcrypt = require('bcrypt');
const { ClientModel } = require('../schema/client.schema');
const { RendezVousModel } = require('../schema/rendezVous.schema');
const { PreferenceModel } = require('../schema/preference.schema');
const { NotificationModel } = require('../schema/notification.schema');
const { ObjectId } = require('mongoose').Types;

class Client {
    constructor(
        nom = null,
        prenom = null,
        email = null,
        mdp = null,
        genre = null,
        dateNaissance = null,
        etat = null,
        dateInscription = null
    ) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.mdp = mdp;
        this.genre = genre;
        this.etat = etat;
        this.dateInscription = dateInscription

        this.setDateNaissance(dateNaissance)
        console.log("hello")
    }

    setDateNaissance(value) {
        try {
            this.dateNaissance = new Date(value);
        } catch (error) {
            throw new Error('Date de naissance invalid');
        }
        if (this.dateNaissance.getTime() > new Date().getTime()) {
            this.dateNaissance = null;
            throw new Error('Date de naissance doit être antérieure à la date actuelle');
        }

    }

    async getNotifications() {
        const query = {
            target: new ObjectId(this._id),
            dateNotification: { $lt: new Date() },
        }
        return await NotificationModel.find(query)
            .sort({ dateNotification: -1 })
            .exec();
    }

    async getPreferences(type) {
        const query = {
            idClient: new ObjectId(this._id),
            type: type,
        }
        return await PreferenceModel.find(query).exec();
    }

    static async getAll() {
        return ClientModel.find();
    }

    static async getByEmail(emaile) {
        return ClientModel.findOne({ email: emaile });
    }

    async insert() {
        if (this.mdp.length < 8) throw new Error('"Le mot de passe doit contenir 8 charactères')
        const client = await ClientModel.findOne({ email: this.email })
        if (client) throw new Error('Email déja utilisé')

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        this.mdp = bcrypt.hashSync(this.mdp, salt);
        const newClient = new ClientModel({ ...this })
        return await newClient.save();
    }

    static async update(id, updatedValues) {
        return ClientModel.findByIdAndUpdate(id, updatedValues, { new: true });
    }

    static async getById(id) {
        return ClientModel.findById(id);
    }

    static async getInscriptionDateById(id) {
        // Supposons que getById renvoie un objet client avec une propriété "inscriptionDate"
        const client = await Client.getById(id);
        console.log(client)
        return client ? client.dateInscription : null;
    }

    // Fonction pour vérifier si la différence entre deux dates est inférieure ou égale à 15 minutes
    static isTimeDifferenceWithin15Minutes(date1, date2) {
        const differenceInMilliseconds = Math.abs(date1 - date2);
        const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
        return differenceInMinutes <= 5;
    }

    // Fonction principale pour vérifier la validité
    static async isValid(id) {
        try {
            const inscriptionDate = await Client.getInscriptionDateById(id);

            console.log(inscriptionDate)

            if (inscriptionDate) {
                const currentDate = new Date();
                const isValidTime = Client.isTimeDifferenceWithin15Minutes(currentDate, new Date(inscriptionDate));

                if (isValidTime) {
                    console.log("La différence est inférieure ou égale à 15 minutes. La validation est réussie.");
                    // Faites quelque chose ici, par exemple, renvoyez true
                    return true;
                } else {
                    console.log("La différence est supérieure à 15 minutes. La validation a échoué.");
                    // Faites quelque chose ici, par exemple, renvoyez false
                    return false;
                }
            } else {
                console.log("Date d'inscription non trouvée. La validation a échoué.");
                // Faites quelque chose ici, par exemple, renvoyez false
                return false;
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la validation :", error);
            // Gérer l'erreur selon vos besoins
            return false;
        }
    }

    static async getRendezVous(id,page=1,limit=5) {
        const skip = (page - 1) * limit;
        // Utilisez l'ID de l'employé pour récupérer les rendez-vous associés
        const listeRdv=await RendezVousModel.find({ "client._id": { $in: [id] } }).skip(skip).limit(5);
        const totalItems=await RendezVousModel.countDocuments({ "client._id": { $in: [id] } });
        return {listeRdv,totalItems};
    }


}

module.exports = Client;