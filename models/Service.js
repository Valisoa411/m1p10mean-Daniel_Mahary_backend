const { ObjectId } = require('mongoose').Types;
const { EmployeeModel } = require('../schema/employe.schema');
const { HoraireModel } = require('../schema/horaire.schema');
const { RendezVousModel } = require('../schema/rendezVous.schema');
const { ServiceModel } = require('../schema/service.schema');
const { horaireGeneral } = require('../util/data');
const { distributeAvailability, parseDateToTimeString, addDuree, getTimeString, getMinuteDifference, parseTimeStringToDate } = require('../util/util');

class Service {
    constructor(
        _id = null,
        nom = null,
        prix = null,
        duree = null,
        commission = null,
        description = null,
        photo = null,
        nbEmploye = null,
    ) {
        this._id = _id;
        this.nom = nom;
        this.prix = prix;
        this.duree = duree;
        this.commission = commission;
        this.description = description;
        this.photo = photo;
        this.nbEmploye = nbEmploye;
    }

    async availableHoraire(selectedDate) {
        const { ouverture, fermeture } = horaireGeneral;
        const day = new Date(selectedDate).getDay();
        const horaireQuery = {
            jour: day,
        }
        const HoraireOfDay = await HoraireModel.find(horaireQuery).exec();
        console.log("HoraireOfDay: ", HoraireOfDay);
        const rendezVousPipeline = [
            {
                $addFields: {
                    formattedDate: {
                        $dateToString: {
                            date: '$date',
                            format: '%Y-%m-%d'
                        }
                    }
                }
            },
            {
                $match: {
                    formattedDate: selectedDate
                }
            },
        ];
        const RendezVousOfDay = await RendezVousModel.aggregate(rendezVousPipeline).exec();
        console.log("selectedDate: ", selectedDate);
        console.log("RendezVousOfDay: ", RendezVousOfDay);
        let availability = [
            {
                debut: ouverture,
                fin: fermeture,
                dispo: 0,
            }
        ]
        console.log("availability0: ", availability);
        HoraireOfDay.forEach((horaire) => {
            availability = distributeAvailability(availability, {
                debut: horaire.debut,
                fin: horaire.fin,
                change: 1,
            })
        })
        console.log("availability1: ", availability);
        RendezVousOfDay.forEach((rendezVous) => {
            const rdvStart = new Date(rendezVous.date);
            const rdvEnd = addDuree(rdvStart, rendezVous.service.duree);
            availability = distributeAvailability(availability, {
                debut: getTimeString(rdvStart),
                fin: getTimeString(rdvEnd),
                change: -rendezVous.service.nbEmploye,
            })
        })
        console.log("availability2: ", availability);
        const result = availability.filter(slot => {
            if (slot.dispo >= this.nbEmploye) {
                const freeTime = getMinuteDifference(slot.debut, slot.fin);
                if (freeTime >= this.duree) return true;
            }
        }).map((slot) => {
            const slotEnd = parseTimeStringToDate(slot.fin);
            slotEnd.setMinutes(slotEnd.getMinutes() - this.duree)
            return {
                debut: slot.debut,
                fin: getTimeString(slotEnd),
                slot: slot.dispo,
            }
        })
        return result;
    }

    //check and test compact version in random_function
    async availableEmploye(selectedDate) {
        console.log(selectedDate);
        const rdvStart = new Date(selectedDate);
        const rdvEnd = addDuree(rdvStart, this.duree);
        console.log(rdvEnd);
        const duree = this.duree;
        console.log(rdvStart);
        const horairePipeline = [
            {
                $match: {
                    jour: rdvStart.getDay(),
                    $or: [
                        {
                            $and: [
                                { 'debut': { $lte: rdvStart.toTimeString().slice(0, 5) } },
                                { 'fin': { $gt: rdvStart.toTimeString().slice(0, 5) } }
                            ]
                        },
                        {
                            $and: [
                                { 'debut': { $lt: rdvEnd.toTimeString().slice(0, 5) } },
                                { 'fin': { $gte: rdvEnd.toTimeString().slice(0, 5) } }
                            ]
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    idEmploye: 1
                }
            }
        ];
        const horaireResult = await HoraireModel.aggregate(horairePipeline).exec();
        console.log(horaireResult);
        const idEmployeList = horaireResult.map(horaire => horaire.idEmploye);
        // console.log("idEmployeList: ", idEmployeList);
        const rendezVousPipeline = [
            {
                $addFields: {
                    endDate: { $add: ["$date", { $multiply: [60000, this.duree] }] }
                }
            },
            {
                $match: {
                    date: { $lte: rdvEnd },
                    endDate: { $gte: rdvStart }
                }
            },
            {
                $project: {
                    _id: 0,
                    employes: 1
                }
            },
            {
                $unwind: "$employes"
            },
            {
                $group: {
                    _id: "$employes._id"
                }
            }
        ];
        const rendezVousResult = await RendezVousModel.aggregate(rendezVousPipeline).exec();
        const idEmployeOccupiedList = rendezVousResult.map(rendezVous => rendezVous.idEmploye);
        // console.log("idEmployeOccupiedList: ", idEmployeOccupiedList);
        const idEmployeAvailableList = idEmployeList
        .filter(id => !idEmployeOccupiedList.includes(id))
        .map(id => new ObjectId(id));
        // console.log("idEmployeAvailableList: ", idEmployeAvailableList);
        const pipeline = [
            {
                $match: {
                    _id: { $in: idEmployeAvailableList }
                }
            },
        ]
        const result = await EmployeeModel.aggregate(pipeline);
        console.log("result: ", result);
        return result;
    }


    async insert() {
        const newServiceMongoose = new ServiceModel({ ...this })
        return await newServiceMongoose.save();
    }

    async getAll() {
        const services = await ServiceModel.find().exec();
        return services;
    }

    async getById() {
        const service = await ServiceModel.findById(this._id).exec();
        return service;
    }

    async update() {
        await ServiceModel.findByIdAndUpdate(this._id, { ...this });
    }

    async delete() {
        await ServiceModel.findByIdAndDelete(this._id);
    }
}

module.exports = Service;