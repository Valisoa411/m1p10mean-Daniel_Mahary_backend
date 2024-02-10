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
            const client = await new Client(
                nom,
                prenom,
                email,
                mdp,
                genre,
                dateNaissance,
                1
            ).insert();
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
}