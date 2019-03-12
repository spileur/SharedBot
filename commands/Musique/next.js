exports.run = (client, message, args) => {
    let music = require("./play").musicDispatcher[message.guild.id];
    require("./play").nextMusic(client, music);
};

exports.info = {
    aliases: ["skip"],
    description: "Passer à la musique suivante",
    usage: "",
    category: "Musique",
    permissions: "",
    showHelp: true
};
