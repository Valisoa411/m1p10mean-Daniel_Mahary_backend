const { PreferenceModel } = require("../schema/preference.schema");

class Preference {
    constructor (
        _id = null,
        idClient = null,
        idObject = null,
        type = null,
        ordre = null,
    ) {
        this._id = _id;
        this.idClient = idClient;
        this.idObject = idObject;
        this.type = type;
        this.ordre = ordre;
    }

    static putPreferenceInList(list, preferences) {
        const listTmp = [];
        list.forEach(element => {
            const preference = preferences.find(preference => preference.idObject === element._id.toString())
            listTmp.push({
                ...JSON.parse(JSON.stringify(element)),
                isPreference: preference ? 1 : 0,
            })
        });
        return listTmp;
    }

    async isInPreference() {
        const preference = await PreferenceModel.findOne({
            idClient: this.idClient,
            idObject: this.idObject,
        }).exec();
        return preference;
    }
    
    async add() {
        if(await this.isInPreference()) {
            throw new Error('Déja dans les préférence');
        }
        const newPreferenceMongoose = new PreferenceModel({...this});
        return await newPreferenceMongoose.save();
    }

    async remove() {
        const preference = await this.isInPreference();
        if(!preference) {
            throw new Error('Préférence introuvable');
        }
        await PreferenceModel.findByIdAndDelete(preference._id);
    }
}

module.exports = Preference;