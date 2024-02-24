const OffreSpecial = require('../models/OffreSpecial')

module.exports = {
    async createOffreSpecial(req, res) {
        try {
            const {nom, service, reduction, dateDebut, dateFin} = req.body;
            const offreSpecial = await new OffreSpecial(nom, service, reduction, dateDebut, dateFin).insert();
            res.status(200).send({
                message: "OffreSpecial enregistrer avec succes",
                offreSpecial,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async allOffreSpecials(req, res) {
        try {
            const offreSpecials = await new OffreSpecial().getAll();
            res.status(200).send({
                offreSpecials,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async getOffreSpecialById(req, res) {
        try {
            let offreSpecial = new OffreSpecial();
            offreSpecial._id = req.params.id;
            offreSpecial = await offreSpecial.getById();
            res.status(200).send({
                offreSpecial,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async updateOffreSpecial(req, res) {
        try {
            const {_id, nom, service, reduction, dateDebut, dateFin} = req.body;
            const offreSpecial = new OffreSpecial(nom, service, reduction, dateDebut, dateFin);
            offreSpecial._id = _id;
            await offreSpecial.update();
            res.status(200).send({
                message: "OffreSpecial enregistrer avec succes",
                offreSpecial,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async deleteOffreSpecial(req, res) {
        try {
            let offreSpecial = new OffreSpecial();
            offreSpecial._id = req.params.id;
            await offreSpecial.delete();
            res.status(200).send({
                message: "OffreSpecial supprimer avec succes",
                offreSpecial,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
}