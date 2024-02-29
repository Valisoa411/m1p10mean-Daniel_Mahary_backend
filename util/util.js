const cleanAvailability = (availability) => {
    const cleanedAvailability = [availability[0]];
    for (let i = 1; i < availability.length; i++) {
        const currentSlot = availability[i];
        const previousSlot = cleanedAvailability[cleanedAvailability.length - 1];
        if (currentSlot.dispo === previousSlot.dispo && currentSlot.debut === previousSlot.fin) {
            previousSlot.fin = currentSlot.fin;
        } else {
            cleanedAvailability.push(currentSlot);
        }
    }
    return cleanedAvailability;
};

const parseTimeStringToDate = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    // const date = new Date(0, 0, 0, hours, minutes);
    const date = new Date(100, 0, 1, hours, minutes);
    return date;
}

module.exports = {
    formatDate(inputDate) {
        if (!inputDate) return '';
        const date = new Date(inputDate);
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        };

        return new Intl.DateTimeFormat('fr-FR', options).format(date);
    },

    parseTimeStringToDate(timeString) {
        const [hours, minutes] = timeString.split(':');
        // const date = new Date(0, 0, 0, hours, minutes);
        const date = new Date(100, 0, 1, hours, minutes);
        return date;
    },

    getTimeString(selectedDate) {
        const date = new Date(selectedDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    getMinuteDifference(start, end) {
        const date1 = parseTimeStringToDate(start);
        const date2 = parseTimeStringToDate(end);

        const timeDifferenceInMillis = date2 - date1;
        const minuteDifference = timeDifferenceInMillis / (1000 * 60);

        return minuteDifference;
    },

    addDuree(selectedDate, duree) {
        const date = new Date(selectedDate);
        date.setMinutes(date.getMinutes() + Number(duree));
        return date;
    },

    distributeAvailability(availability, change) {
        const { debut: changeDebut, fin: changeFin, change: changeDispo } = change;
        if (!changeDebut || !changeFin || changeDispo === undefined) {
            throw new Error('Invalid change input');
        }
        const newAvailability = [];
        for (const slot of availability) {
            const { debut, fin, dispo } = slot;
            if (debut < changeFin && fin > changeDebut) {
                const overlappingSlots = [];
                if (debut < changeDebut) {
                    overlappingSlots.push({ debut, fin: changeDebut, dispo });
                }
                overlappingSlots.push({ debut: debut < changeDebut ? changeDebut : debut, fin: fin > changeFin ? changeFin : fin, dispo: dispo + changeDispo });
                if (fin > changeFin) {
                    overlappingSlots.push({ debut: changeFin, fin, dispo });
                }
                newAvailability.push(...overlappingSlots);
            } else {
                newAvailability.push({ debut, fin, dispo });
            }
        }
        return cleanAvailability(newAvailability);
    },
}

