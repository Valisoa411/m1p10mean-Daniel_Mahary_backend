module.exports = {
    parseTimeStringToDate(timeString){
        const [hours, minutes] = timeString.split(':');
        const date = new Date(0, 0, 0, hours, minutes);
        return date;
    },
}