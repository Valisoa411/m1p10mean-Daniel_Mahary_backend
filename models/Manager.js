const bcrypt = require('bcrypt');
const mongoose = require('../db/db');

const ManagerSchema = new mongoose.Schema({
    login: String,
    mdp: String,
})

const ManagerModel = mongoose.model('Manager', ManagerSchema);

class Manager {
    constructor(
        login = null,
        mdp = null,
    ) {
        this.login = login;
        this.mdp = mdp;
    }

    async insert() {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        this.mdp = bcrypt.hashSync(this.mdp, salt);
        const newManager = new ManagerModel({ ...this })
        return await newManager.save();
    }

    async loginManager() {
        const manager = await ManagerModel.findOne({ login: this.login });
        if (manager) {
            const passwordMatch = bcrypt.compare(this.mdp, manager.mdp);
            if (passwordMatch) {
                return manager;
            } else {
                throw new Error('Mot de passe incorect');
            }
        } else {
            throw new Error('Manager introuvable');
        }
    }
}

module.exports = Manager;