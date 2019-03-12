const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    username: String,
    fortnitePseudo: String,
    warns: [{type: mongoose.Schema.Types.ObjectId, ref: 'Warns'}]
});

module.exports = mongoose.model("User", userSchema);