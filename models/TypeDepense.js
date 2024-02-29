const { TypeDepenseModel } = require("../schema/typeDepense.schema");
const ObjectId = require('mongoose').Types.ObjectId;
class TypeDepense{
    constructor(
        label = null,
    )
    {
        this.label=label;
    }
    async insert() {
        const newTypeDepenseMongoose = new TypeDepenseModel({...this});
        return await newTypeDepenseMongoose.save();
    }
    static async getAll() {
        return await TypeDepenseModel.find();
    }
    static async getTypeDepenseById(id) {
        return await TypeDepenseModel.findById(id);
    }
}

module.exports = TypeDepense;