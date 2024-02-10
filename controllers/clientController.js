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
            const updatedValues={"etat":11}
            const client = await Client.update(id, updatedValues);
            res.status(200).send({
                message: "inscription valide",
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
}