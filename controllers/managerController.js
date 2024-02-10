const Manager = require('../models/Manager');

module.exports = {
    async initManager(req, res) {
        try {
            const manager = await new Manager(
                null,
                "val",
                "1234"
            ).insert();
            res.status(200).send({
                message: "Manager initialise",
                manager,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    async loginManager(req,res) {
        try {
            const {
                login,
                mdp,
            } = req.body;
            const manager = await new Manager(
                login,
                mdp
            ).loginManager();
            res.status(200).send({
                message: "Manager connecte avec succes",
                manager,
            });
        } catch (error) {
            console.log("loginManager error: ", error);
            res.status(500).send({
                message: error.message
            })
        }
    }
}