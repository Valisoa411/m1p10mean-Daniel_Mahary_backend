const Service = require('../models/Service')

module.exports = {
    async getAvailableHoraire(req, res) {
        try {
            const { idService, selectedDate } = req.query;
            const result = await new Service(idService).getById();
            const service = new Service();
            service.duree = result.duree;
            service.nbEmploye = result.nbEmploye
            const availabilities = await service.availableHoraire(selectedDate);
            res.status(200).send({
                availabilities,
            })
        } catch (error) {
            // console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },

    async getAvailableEmploye(req, res) {
        try {
            const { idService, selectedDate } = req.query;
            console.log(idService);
            console.log(selectedDate);
            const result = await new Service(idService).getById();
            const service=new Service();
            service.duree = result.duree;
            const employees = await service.availableEmploye(selectedDate);
            console.log(employees);
            res.status(200).send({
                employees,
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },



    async createService(req, res) {
        try {
            const {nom, prix, duree, commission, description, photo, nbEmploye} = req.body;
            const service = await new Service(nom, prix, duree, commission, description, photo, nbEmploye).insert();
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
            const {_id, nom, prix, duree, commission, description, photo, nbEmploye} = req.body;
            const service = new Service(nom, prix, duree, commission, description, photo, nbEmploye);
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
                message: "Service supprimer avec succes",
                service,
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
}