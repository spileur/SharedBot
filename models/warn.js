const mongoose = require('mongoose');

const warnSchema = mongoose.Schema({
    userID: String,
    moderatorID: String,
    guildID: String,
    date: Date,
    reason: String
});

module.exports = mongoose.model("Warn", warnSchema);