export const parseTimeStringToDate = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(0, 0, 0, hours, minutes);
    return date;
};

export const addDuree = (selectedDate, duree) => {
    const date = new Date(selectedDate);
    date.setMinutes(date.getMinutes() + Number(duree));
    return date;
}