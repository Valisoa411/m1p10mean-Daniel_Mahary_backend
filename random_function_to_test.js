async availableEmploye(selectedDate) {
    const rdvStart = new Date(selectedDate);
    const rdvEnd = addDuree(rdvStart, this.duree);

    const pipeline = [
        {
            $match: {
                $and: [
                    { 'jour': rdvStart.getDay() + 1 },
                    {
                        $or: [
                            { $and: [{ 'debut': { $lte: rdvStart.toTimeString().slice(0, 5) } }, { 'fin': { $gt: rdvStart.toTimeString().slice(0, 5) } }] },
                            { $and: [{ 'debut': { $lt: rdvEnd.toTimeString().slice(0, 5) } }, { 'fin': { $gte: rdvEnd.toTimeString().slice(0, 5) } }] }
                        ]
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "RendezVousModel",
                let: { idEmploye: "$idEmploye" },
                pipeline: [
                    {
                        $addFields: {
                            endDate: { $add: ["$date", { $multiply: [60000, this.duree] }] }
                        }
                    },
                    {
                        $match: {
                            date: { $lte: rdvEnd },
                            endDate: { $gte: rdvStart },
                            "employes._id": "$$idEmploye"
                        }
                    },
                    {
                        $project: { _id: 0, "employes._id": 1 }
                    }
                ],
                as: "rendezVousResults"
            }
        },
        {
            $match: {
                rendezVousResults: { $eq: [] }
            }
        },
        {
            $project: {
                _id: 0,
                idEmploye: 1
            }
        }
    ];

    try {
        const result = await HoraireModel.aggregate(pipeline).exec();
        const idEmployeAvailableList = result.map(horaire => horaire.idEmploye);

        const employeQuery = { '_id': { $in: idEmployeAvailableList } };
        const employees = await EmployeeModel.find(employeQuery).exec();

        return employees;
    } catch (error) {
        console.error(error);
        throw new Error("Error retrieving available employees");
    }
}
