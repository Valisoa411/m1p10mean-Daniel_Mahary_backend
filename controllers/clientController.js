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
            await new Client(
                null,
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
}