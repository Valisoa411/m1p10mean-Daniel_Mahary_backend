const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const SendMail = require('../models/SendMail');

module.exports = {
    async signUpClient(req, res) {
        try {
            const {
                nom,
                prenom,
                email,
                mdp,
                genre,
                dateNaissance
            } = req.body;
            const cli=await new Client(
                nom,
                prenom,
                email,
                mdp,
                genre,
                dateNaissance,
                10,
                new Date()
            ).insert();
            mail= new SendMail(cli);
            mail.send();
            res.status(200).send({
                message: "Client inscrit avec succes",
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
    async validation_inscription(req, res) {
        try {
          const id = req.params.id;

          console.log(id)
      
          // Vérifier si l'état n'est pas déjà validé (etat = 1)
          const existingClient = await Client.getById(id);
          if (existingClient.etat === 1) {
            return res.status(400).send({
              message: "L'inscription a déjà été validée.",
            });
          }
          
          // Vérifier si la date d'inscription est encore valide (ajoutez votre propre logique ici)
          const inscriptionDateIsValid = await Client.isValid(id); // Vous devrez définir isDateValid en fonction de vos critères

      
          if (!inscriptionDateIsValid) {
            return res.status(400).send({
              message: "Le lien d'inscription n'est plus valide. Veuillez refaire l'inscription.",
            });
          }
      
          // Mettre à jour l'état du client
          const updatedValues = { "etat": 1 };
          const updatedClient = await Client.update(id, updatedValues);

          const payload={ idclient: id }

          
          const token = jwt.sign(payload, "beauty", { expiresIn: '5m' });

          const decoded = jwt.verify(token, "beauty");
          user = decoded;

          console.log(token);

          console.log(user);
          
      
          res.status(200).send({
            message: "Inscription validée.",
            token: token
          });
        } catch (error) {
          console.log(error.message);
          res.status(500).send({
            message: error.message
          });
        }
      },
      async liste_client(req, res) {
        try {
          const clients = await Client.getAll();
          res.json(clients);
        } catch (error) {
          console.error('Erreur lors de la récupération de la liste des clients :', error);
          res.status(500).json({ error: 'Erreur lors de la récupération de la liste des clients.' });
        }
      },
      async login(req, res) {
        try {
          const {
            nom,
            prenom,
            email,
            mdp,
            genre,
            dateNaissance
        } = req.body;
          res.json(clients);
        } catch (error) {
          console.error('Erreur lors de la récupération de la liste des clients :', error);
          res.status(500).json({ error: 'Erreur lors de la récupération de la liste des clients.' });
        }
      }


}