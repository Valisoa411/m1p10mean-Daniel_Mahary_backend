const RendezVous = require("../models/RendezVous");
const { ClientModel } = require("../schema/client.schema");
const { RendezVousModel } = require("../schema/rendezVous.schema");

module.exports = {
    async createRendezVous(req, res) {
        try {
            const { service, date, employes, prixFinal } = req.body;
            const client = await ClientModel.findById(req.user.idclient);
            console.log("client: ", req.user);
            let rendezVous = new RendezVous(client, service, date, employes, prixFinal, "En attente");
            rendezVous = rendezVous.insert();
            res.status(200).send({
                message: "Rendez-vous enregistrer avec succes",
                rendezVous,
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: error.message
            })
        }
    },
    async getRdvById(req, res) {
        try {
            let rdv = new RendezVous();
            rdv._id = req.params.id;
            console.log(rdv._id);
            let rdv_new=await RendezVous.getById(rdv._id);
            console.log(rdv_new);
            res.status(200).json(rdv_new);
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },
    async updateRdv(req,res){
        try {
            console.log(req.body);
            const {_id,client, service, date, employes, prixFinal,etat} = req.body;
            const rdv = new RendezVous(client, service, date, employes, prixFinal, etat);
            const updatedData = { client, service, date, employes, prixFinal, etat };
            console.log(rdv.client);
            await RendezVous.update(_id, updatedData);
            res.status(200).send({
                message: "Rendez-vous enregistrer avec succes",
            })
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }

    }
}