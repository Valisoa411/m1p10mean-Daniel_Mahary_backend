const Employe = require('../models/Employe')
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const bcrypt=require('bcrypt');
const Client = require('../models/Client');
const Preference = require('../models/Preference');


cloudinary.config({
    cloud_name: 'dvtkhsny1',
    api_key: '999825127837776',
    api_secret: '0sFwm7muxMkLhiF4BTB6k4A-yqg'
});

// Fonction pour extraire le public_id à partir de l'URL Cloudinary

module.exports = {
    async allEmployesWithPreferences(req, res) {
        try {
            let employes = await Employe.getAllEmployees();
            const { idclient, role } = req.user;
            if(role === 'client') {
                const client = new Client();
                client._id = idclient;
                const preferences = await client.getPreferences('employe');
                employes = Preference.putPreferenceInList(employes, preferences);
            }
            res.status(200).send({
                employes,
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },

    async getEmployeHoraires(req, res) {
        try {
            const horaires = await Employe.getHoraires(req.user.idemploye);
            console.log(horaires);
            res.status(200).send({
                horaires,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }

    },

    async createEmploye(req, res) {
        try {
            const {nom} = req.body;
            const employe = await new Employe(nom).insert();
            res.status(200).send({
                employe,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async info_employe(req, res) {
        try {
            const employe = await Employe.getById(req.user.idemploye);
            console.log(employe);
            res.json(employe);
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                message: error.message
            })
        }
    },

    async signinEmploye(req,res){
        try {
            const { login, mdp } = req.body;
    
            // Vérification de l'existence de l'email dans la base de données
            const existingEmploye = await Employe.getByEmail(login);
    
            if (!existingEmploye) {
                return res.status(400).json({ message: 'ce login n\'existe pas dans la base de données. Veuillez vous inscrire.' });
            }
    
            const isPasswordCorrect = await bcrypt.compare(mdp, existingEmploye.mdp);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Mot de passe incorrect. Veuillez réessayer.' });
            }
            // Vérification du mot de passe
  
            
            // Génération du token
            const payload = { idemploye: existingEmploye._id,role: "employe" };
            const token = jwt.sign(payload, 'beauty', { expiresIn: '1h' });
  
            console.log("hello");
    
            // Renvoi du token en cas de succès
            res.status(200).json({ message: 'Connexion réussie.', token });
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    
    },
    async updateEmployeWithPic(req, res) {
        try {
          const employeId = req.user.idemploye;
          const { nom, prenom, cin, login, mdp  } = req.body;

          const photo = req.file;
      
          // Récupérez l'employé existant
          const employe = await Employe.getEmployeeById(employeId);
      
          if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé' });
          }
      
          // Mettez à jour les champs de l'employé
          employe.nom = nom || employe.nom;
          employe.prenom = prenom || employe.prenom;
          employe.cin = cin || employe.cin;
          employe.login = login || employe.login;
          employe.mdp = mdp || employe.mdp;
      
          // Mettez à jour la photo si une nouvelle photo est fournie
          if (photo) {
            // Utilisez ici la logique pour traiter la nouvelle photo (téléchargement vers Cloudinary, etc.)
            const cloudinaryResponse = await cloudinary.uploader.upload(photo.path, {
              folder: 'employees', // Spécifiez le dossier sur Cloudinary où stocker les photos
              resource_type: 'image',
              public_id: `employee_${employe._id}`,
              overwrite: true
            });
      
            employe.photo = cloudinaryResponse.secure_url;
          }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        employe.mdp = bcrypt.hashSync(employe.mdp, salt);
      
          // Enregistrez les mises à jour de l'employé
          await employe.save();
      
          res.status(200).json(employe);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'employé :', error);
          res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé.' });
        }
    }, 
    async updateEmploye(req,res){
        try {
            const employeId = req.user.idemploye;
            const { nom, prenom, cin, login, mdp  } = req.body;
        
            // Récupérez l'employé existant
            const employe = await Employe.getEmployeeById(employeId);
        
            if (!employe) {
              return res.status(404).json({ message: 'Employé non trouvé' });
            }
        
            // Mettez à jour les champs de l'employé
            employe.nom = nom || employe.nom;
            employe.prenom = prenom || employe.prenom;
            employe.cin = cin || employe.cin;
            employe.login = login || employe.login;
            employe.mdp = mdp || employe.mdp;
        

            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            employe.mdp = bcrypt.hashSync(employe.mdp, salt);
            // Mettez à jour la photo si une nouvelle photo est fournie
            // Enregistrez les mises à jour de l'employé
            await employe.save();
        
            res.status(200).json(employe);
          } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'employé :', error);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'employé.' });
          }
    },
    async listeRdv(req,res){
        try {
            const rendezVous = await Employe.getRendezVous(req.user.idemploye);
            res.status(200).send({
              rendezVous,
            });
        } catch (error) {
            res.status(500).send({
              message: error.message,
            });
        }
    }


}