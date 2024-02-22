const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const SendMail = require('../models/SendMail');
const bcrypt=require('bcrypt');

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
                0,
                new Date()
            ).insert();
            mail= new SendMail(cli);
            mail.send();
            res.status(200).send({
                message: "Client inscrit avec succes",
                client,
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
            return res.status(401).send({
              message: "Le lien d'inscription n'est plus valide. Veuillez refaire l'inscription.",
            });
          }
      
          // Mettre à jour l'état du client
          const updatedValues = { "etat": 1 };
          const updatedClient = await Client.update(id, updatedValues);

          const payload={ idclient: id }

          
          const token = jwt.sign(payload, "beauty", { expiresIn: '1h' });

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
      async signInClient(req, res) {
        try {
          const { email, mdp } = req.body;
  
          // Vérification de l'existence de l'email dans la base de données
          const existingClient = await Client.getByEmail(email);
  
          if (!existingClient) {
              return res.status(400).json({ error: 'L\'email n\'existe pas dans la base de données. Veuillez vous inscrire.' });
          }
  
          // Vérification de l'état du client
          if (existingClient.etat !== 1) {
              return res.status(400).json({ error: 'Votre compte n\'a pas encore été validé. Veuillez vérifier votre email.' });
          }
  
          // Vérification du mot de passe
          console.log(existingClient.mdp);
          const isPasswordCorrect = await bcrypt.compare(mdp, existingClient.mdp);
          if (!isPasswordCorrect) {
              return res.status(401).json({ error: 'Mot de passe incorrect. Veuillez réessayer.' });
          }

          
          // Génération du token
          const payload = { idclient: existingClient._id, role: 'client' };
          const token = jwt.sign(payload, 'beauty', { expiresIn: '1h' });

          console.log("hello");
  
          // Renvoi du token en cas de succès
          res.status(200).json({ message: 'Connexion réussie.', token });
      } catch (error) {
          console.error('Erreur lors de la connexion :', error);
          res.status(500).json({ error: 'Erreur interne du serveur.' });
      }
  
    },

}