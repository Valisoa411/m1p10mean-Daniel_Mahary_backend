const Preference = require("../models/Preference");

module.exports = {
    async addPreference(req, res) {
        try {
            const { idObject, type } = req.body;
            const idClient = req.user.idclient;
            const preference = await new Preference(null, idClient, idObject, type, 0).add();
            res.status(200).send({
                message: "Preference enregistrer avec succes",
                preference,
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },

    async removePreference(req, res) {
        try {
            const { idObject } = req.params;
            const idClient = req.user.idclient;
            await new Preference(null, idClient, idObject, null, 0).remove();
            res.status(200).send({
                message: "Preference enregistrer avec succes",
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },
}