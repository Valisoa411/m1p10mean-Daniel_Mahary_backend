const { mongoose } = require("../db/db");

const NotificationSchema = new mongoose.Schema({
    type: String,
    target: String,
    titre: String,
    text: String,
    lien: String,
    dateNotification: Date,
    checked: Boolean,
})

module.exports = {
    NotificationSchema,
    NotificationModel: mongoose.model('Notification', NotificationSchema),
}