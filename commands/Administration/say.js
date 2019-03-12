const Discord = require("discord.js");

exports.run = (client, message, args) =>{
    if (args.length > 0) {
        message.channel.send(args.join(" ")).then((msg) => {
            message.delete();
        });

    } else {
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'say [message]');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.info = {
    aliases: [],
    description: "Parler à la place du bot",
    usage: "[message]",
    category: "Administration",
    permissions: "KICK_MEMBERS",
    showHelp: true
};
