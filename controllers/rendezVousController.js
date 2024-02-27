const RendezVous = require("../models/RendezVous");
const { ClientModel } = require("../schema/client.schema");

module.exports = {
    async createRendezVous(req, res) {
        try {
            const { service, date, employes, prixFinal } = req.body;
            const client = await ClientModel.findById(req.user.idclient);
            console.log("client: ", req.user);
            let rendezVous = new RendezVous(null, client, service, date, employes, prixFinal, "En attente");
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
}