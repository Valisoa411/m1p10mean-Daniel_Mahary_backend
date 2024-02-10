const Client = require('../models/Client');

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
                10
            ).insert();
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
          
          console.log("eto")
          // Vérifier si la date d'inscription est encore valide (ajoutez votre propre logique ici)
          const inscriptionDateIsValid = await Client.isValid(id); // Vous devrez définir isDateValid en fonction de vos critères

          console.log("ok")
      
          if (!inscriptionDateIsValid) {
            return res.status(400).send({
              message: "Le lien d'inscription n'est plus valide. Veuillez refaire l'inscription.",
            });
          }
      
          // Mettre à jour l'état du client
          const updatedValues = { "etat": 1 };
          const updatedClient = await Client.update(id, updatedValues);
      
          res.status(200).send({
            message: "Inscription validée.",
          });
        } catch (error) {
          res.status(500).send({
            message: error.message
          });
        }
      },
}