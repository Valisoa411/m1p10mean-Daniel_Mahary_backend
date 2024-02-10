const Service = require('../models/Service')

module.exports = {
    async createService(req, res) {
        try {
            const {nom, prix, duree, commission, description, photo} = req.body;
            const service = await new Service(nom, prix, duree, commission, description, photo).insert();
            res.status(200).send({
                message: "Service enregistrer avec succes",
                service,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async allServices(req, res) {
        try {
            const services = await new Service().getAll();
            res.status(200).send({
                message: "succes",
                services,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async getServiceById(req, res) {
        try {
            let service = new Service();
            service._id = req.params.id;
            service = await service.getById();
            res.status(200).send({
                message: "succes",
                service,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async updateService(req, res) {
        try {
            const _id = req.params.id;
            const {nom, prix, duree, commission, description, photo} = req.body;
            const service = new Service(nom, prix, duree, commission, description, photo);
            service._id = _id;
            await service.update();
            res.status(200).send({
                message: "Service enregistrer avec succes",
                service,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async deleteService(req, res) {
        try {
            let service = new Service();
            service._id = req.params.id;
            await service.delete();
            res.status(200).send({
                message: "succes",
                service,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
}