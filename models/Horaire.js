const HoraireModel = require('../schema/horaire.schema');

class Horaire {
    constructor(
        idEmploye = null,
        jour = null,
        debut = null,
        fin = null,
    ) {
        this.idEmploye = idEmploye;
        this.jour = jour;
        this.setPlage(debut, fin)
    }

    setPlage(debut, fin) {
        const debutTime = new Date(`2000-01-01T${debut}`);
        const finTime = new Date(`2000-01-01T${fin}`);
        if (debutTime > finTime) {
            throw new Error('Le début de l\'horaire doit être avant la fin');
        }
        this.debut = debut;
        this.fin = fin;
    }

    async checkAvailability() {
        const pipeline = [
            {
                $match: {
                    idEmploye: this.idEmploye,
                    jour: Number(this.jour),
                    $expr: {
                        $and: [
                            { $lt: ["$debut", this.fin] },
                            { $gt: ["$fin", this.debut] }
                        ]
                    }
                }
            }
        ];
        const horaires = await HoraireModel.aggregate(pipeline);
        if (horaires.length > 0) {
            throw new Error('Plage horaire déjà utilisée');
        }
    }

    async insert() {
        await this.checkAvailability();
        const newHoraireMongoose = new HoraireModel({ ...this });
        return await newHoraireMongoose.save();
    }

    async getAll() {
        const horaires = await HoraireModel.find().exec();
        return horaires;
    }

    async getById() {
        const horaire = await HoraireModel.findById(this._id).exec();
        return horaire;
    }

    async update() {
        await HoraireModel.findByIdAndUpdate(this._id, { ...this });
    }

    async delete() {
        await HoraireModel.findByIdAndDelete(this._id);
    }
}

module.exports = Horaire;