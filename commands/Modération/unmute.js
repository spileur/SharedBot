const mongoose = require('mongoose');
const Discord = require("discord.js");
const Sanction = require('../../models/sanction');

exports.run = (client, message, args) =>{
    if (args.length > 0) {
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target) {
            exports.unmute(client, message, target, message.author);
        }else{
            message.channel.send(":x: Le membre est introuvable").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        }
    } else {
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'unmute [mention]');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.unmute = function(client, message, target, modo){
    client.connectDatabase(client, mongoose);
    let roleMuted = target.guild.roles.find((role) => role.name === "Muted");
    if(roleMuted === undefined){
        message.channel.send(":x: Le role `Muted` est introuvable sur le serveur").then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
        return;
    }
    Sanction.find({
        userID: target.user.id,
        guildID: message.guild.id,
        type: "mute",
        finish: false
    }, function(err, docs){
        if(!docs || docs.length <= 0) return message.channel.send(":x: Le membre n'est pas mute");
        docs[0].finish = true;
        docs[0].save(mongoose.disconnect());
        target.removeRole(roleMuted).then(() => {
            message.delete();
            message.channel.send(`:scales: ${target} a été unmute par ${modo}`);
            let log = new Discord.RichEmbed()
                .setColor("#24ff1f")
                .setAuthor("UNMUTE | "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL)
                .addField("Modérateur", modo.displayName, true)
                .setTimestamp(new Date());
            message.guild.channels.get(client.modoLogID).send(log);
        }).catch(() => {
            message.channel.send(":x: Vous n'avez pas la permisson suiffisante de unmute ce membre").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        });
    });
};

exports.info = {
    aliases: [],
    description: "Démute un membre",
    usage: "[mention]",
    category: "Modération",
    permissions: "MANAGE_NICKNAMES",
    showHelp: true
};
