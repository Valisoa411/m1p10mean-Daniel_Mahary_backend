const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const SendMail = require('../models/SendMail');
const Employe = require('../models/Employe');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const bcrypt=require('bcrypt');
const Manager = require('../models/Manager');
const TypeDepense = require('../models/TypeDepense');
const Depense = require('../models/Depense');


cloudinary.config({
    cloud_name: 'dvtkhsny1',
    api_key: '999825127837776',
    api_secret: '0sFwm7muxMkLhiF4BTB6k4A-yqg'
});

// Fonction pour extraire le public_id à partir de l'URL Cloudinary
function extractPublicId(photoUrl) {
    const parts = photoUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0]; // Exclut l'extension du fichier
    return publicId;
}
  

module.exports = {
    async createEmploye(req, res) {
        try {
            const { nom,prenom,cin,genre,login,mdp} = req.body
            const photo = req.file;

            console.log(photo.path)

            const client= await new Employe(nom,prenom,cin,genre,login,mdp, "temp").insert();


        
            // Uploader la photo sur Cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(photo.path, {
              folder: 'employees', // Spécifiez le dossier sur Cloudinary où stocker les photos
              resource_type: 'image',
              public_id: `employee_${client._id}`,
              overwrite: true
            });

            client.photo=cloudinaryResponse.secure_url;
            await client.save();

            client.mdp=mdp;

            new SendMail().sendPassword(client);
        
            res.status(201).json(client);
          } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'employé :', error);
            res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'employé' });
          }
    },
    async liste_employe(req, res) {
        try {
          const {page,limit}=req.query;
          const clients = await Employe.getAllEmployees(page,limit);
          res.json(clients);
        } catch (error) {
          console.error('Erreur lors de la récupération de la liste des clients :', error);
          res.status(500).json({ message: 'Erreur lors de la récupération de la liste des clients.' });
        }
    },
    async delete_employe(req, res) {
        try {
            const employeId = req.params.id;
      
            // Récupérer l'employé pour obtenir le public_id de la photo
            const employe = await Employe.getEmployeeById(employeId);
      
            if (!employe) {
              return res.status(404).json({ message: 'Employé non trouvé' });
            }
      
            // Supprimer l'employé de la base de données
            await Employe.deleteEmployee(employeId);
      
            // Supprimer la photo sur Cloudinary en utilisant le public_id
            const publicId = extractPublicId(employe.photo);
            console.log(publicId);
            await cloudinary.uploader.destroy("employees/"+publicId);
      
            res.status(200).json({ message: 'Employé supprimé avec succès' });
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'employé :', error);
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'employé' });
          }
    },
    async initManager(req, res) {
        try {
            const manager = await new Manager(
                null,
                "val",
                "1234"
            ).insert();
            res.status(200).send({
                message: "Manager initialise",
                manager,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
    async loginManager(req,res) {
        try {
            const {
                login,
                mdp,
            } = req.body;
            const manager = await new Manager(
                login,
                mdp
            ).loginManager();
            const payload = {idmanager: manager._id, role:'manager'}
            const token = jwt.sign(payload, 'beauty', { expiresIn: '1h' });
            res.status(200).send({
                message: "Manager connecte avec succes",
                token,
            });
        } catch (error) {
            console.log("loginManager error: ", error);
            res.status(500).send({
                message: error.message
            })
        }
    },
    async searchEmploye(req, res) {
        try {
          const { q,page,limit } = req.query;
    
          // Utiliser la méthode statique searchElastic de votre modèle Employe
          const result = await Employe.searchElastic(q,page,limit);
    
          res.status(200).json(result);
        } catch (error) {
          console.error('Erreur lors de la recherche d\'employés :', error);
          res.status(500).json({ message: 'Erreur lors de la recherche d\'employés.' });
        }
    },
    async info_employe(req, res) {
        try {
            const {idemploye}=req.query;
            const employe = await Employe.getById(idemploye);
            console.log(employe);
            res.json(employe);
        } catch (error) {
            console.log(error.message);
            res.status(500).send({
                message: error.message
            })
        }
    },
    async createTypeDepense(req,res){
        try {
            const {label} = req.body;

            console.log(label);

            const typedepense= await new TypeDepense(label).insert();

            res.status(201).json(typedepense);
          } catch (error) {
            console.error('Erreur lors de l\'ajout de typedepense :', error);
            res.status(500).json({ message: 'Erreur lors de l\'ajout de typedepense' });
          }
    },
    async allTypeDepense(req,res){
        try {
            const listeTypeDepense = await TypeDepense.getAll();
            res.json(listeTypeDepense);
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste de typedepense :', error);
            res.status(500).json({ message: 'Erreur lors de la récupération de la liste de typedepense.' });
        }
    },
    async getTypeDepenseId(req,res){
            try {
                const {idtypedepense}=req.query;
                console.log(idtypedepense);
                const typeDepense = await TypeDepense.getTypeDepenseById(idtypedepense);
                console.log(typeDepense);
                res.status(200).json(
                    typeDepense
                );
            } catch (error) {
                res.status(500).send({
                    message: error.message
                })
            }    
    },
    async createDepense(req,res){
        try {
            const {typedepense,mois,montant,annee} = req.body;

            const depense= await new Depense(typedepense,mois,montant,annee).insert();

            res.status(201).json(depense);
          } catch (error) {
            console.error('Erreur lors de l\'ajout de dépense :', error);
            res.status(500).json({ message: 'Erreur lors de l\'ajout de dépense' });
          }
    },
    async allDepense(req,res){
        try {
            const {page,limit}=req.query;
            const listeDepense = await Depense.getAll(page,limit);
            console.log(listeDepense);
            res.json(listeDepense);
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste de dépense :', error);
            res.status(500).json({ message: 'Erreur lors de la récupération de la liste de dépense.' });
        }
    },
    async delete_depense(req, res) {
        try {
            const depenseId = req.params.id;
      
            // Récupérer l'employé pour obtenir le public_id de la photo
      
            // Supprimer l'employé de la base de données
            await Depense.deleteDepense(depenseId);
      
            // Supprimer la photo sur Cloudinary en utilisant le public_id
      
            res.status(200).json({ message: 'Depense supprimé avec succès' });
          } catch (error) {
            console.error('Erreur lors de la suppression de dépense :', error);
            res.status(500).json({ message: 'Erreur lors de la suppression de dépense' });
          }
    }

}