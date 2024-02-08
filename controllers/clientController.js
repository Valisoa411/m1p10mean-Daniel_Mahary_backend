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

            const result = new Client(
                null,
                nom,
                prenom,
                email,
                mdp,
                genre,
                dateNaissance,
                10
            ).insert();
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
}