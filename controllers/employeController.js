const Employe = require('../models/Employe')

module.exports = {
    async createEmploye(req, res) {
        try {
            const {nom} = req.body;
            const employe = await new Employe(nom).insert();
            res.status(200).send({
                employe,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async getEmployeById(req, res) {
        try {
            let employe = new Employe();
            employe._id = req.params.id;
            employe = await employe.getById();
            res.status(200).send({
                employe,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
}