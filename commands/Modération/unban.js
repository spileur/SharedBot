const mongoose = require('mongoose');
const Discord = require("discord.js");
const Sanction = require('../../models/sanction');

exports.run = (client, message, args) =>{
    if (args.length > 0) {
        let target = args[0].replace(/[\\<>@#&!]/g, "");
        args.shift();
        exports.unban(client, message, target, message.author);
    } else {
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'unban [id]');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.unban = function(client, message, target, modo){
    client.connectDatabase(client, mongoose);
    Sanction.find({
        userID: target,
        guildID: message.guild.id,
        type: "ban",
        finish: false
    }, function(err, docs){
        if(!docs || docs.length <= 0) return message.channel.send(":x: Le membre n'est pas ban");
        docs.forEach((doc) => {
            doc.finish = true;
            doc.save();
        });
        message.guild.unban(target).then(() => {
            message.delete();
            message.channel.send(`:scales: ${target} à été unban par ${modo}`);
            let log = new Discord.RichEmbed()
                .setColor("#24ff1f")
                .setAuthor("UNBAN | "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL)
                .addField("Modérateur", modo.displayName, true)
                .setTimestamp(new Date());
            message.guild.channels.get(client.modoLogID).send(log);
        }).catch(() => {
            message.channel.send(":x: Vous n'avez pas la permisson suiffisante de unban ce membre").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        });
    });

};

exports.info = {
    aliases: [],
    description: "Déban un membre",
    usage: "[id]",
    category: "Modération",
    permissions: "MANAGE_NICKNAMES",
    showHelp: true
};
