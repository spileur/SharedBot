const Discord = require("discord.js");

exports.run = (client, message, args) =>{
    message.channel.send("> Exit");
    process.exit();
    
};

exports.info = {
    aliases: [],
    description: "Arrêter le bot",
    usage: "[embed]",
    category: "Administration",
    permissions: "ADMINISTRATOR",
    showHelp: true
};
