const mongoose = require('mongoose');

const warnSchema = mongoose.Schema({
    userID: String,
    moderatorID: String,
    guildID: String,
    type: String,
    date: Date,
    duration: Number,
    reason: String,
    finish: Boolean
});

module.exports = mongoose.model("Sanction", warnSchema);