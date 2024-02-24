const Horaire = require('../models/Horaire')

module.exports = {
    async createHoraire(req, res) {
        try {
            const {idEmploye, jour, debut, fin} = req.body;
            const horaire = await new Horaire(idEmploye, jour, debut, fin).insert();
            res.status(200).send({
                message: "Horaire enregistrer avec succes",
                horaire,
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },

    async allHoraires(req, res) {
        try {
            const horaires = await new Horaire().getAll();
            res.status(200).send({
                horaires,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async getHoraireById(req, res) {
        try {
            let horaire = new Horaire();
            horaire._id = req.params.id;
            horaire = await horaire.getById();
            res.status(200).send({
                horaire,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async updateHoraire(req, res) {
        try {
            const {_id, idEmploye, jour, debut, fin} = req.body;
            const horaire = new Horaire(idEmploye, jour, debut, fin);
            horaire._id = _id;
            await horaire.update();
            res.status(200).send({
                message: "Horaire enregistrer avec succes",
                horaire,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async deleteHoraire(req, res) {
        try {
            let horaire = new Horaire();
            horaire._id = req.params.id;
            await horaire.delete();
            res.status(200).send({
                message: "Horaire supprimer avec succes",
                horaire,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
}