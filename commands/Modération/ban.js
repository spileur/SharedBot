const mongoose = require('mongoose');
const Discord = require("discord.js");
const Sanction = require('../../models/sanction');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");

exports.run = (client, message, args) =>{
    if (args.length > 0) {
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target) {
            if(target.highestRole.calculatedPosition < message.member.highestRole.calculatedPosition){
                let reason = (args.length > 0)?args.join(" "):undefined;
                exports.ban(client, message, target, message.member, reason);
            }else{
                message.channel.send(":x: Vous n'avez pas la permisson suiffisante de ban ce membre").then((value) => {
                    message.delete(10000);
                    value.delete(10000);
                });
            }
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
            .setDescription(client.config.prefix+'ban [mention] (raison)');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.ban = function (client, message, target, modo, reason){
    client.connectDatabase(client, mongoose);
    Sanction.findOne({
        userID: target.user.id,
        guildID: message.guild.id,
        type: "ban",
        finish: false
    }, function(err, doc) {
        if(doc) return message.channel.send(":x: Le membre est déjà ban");
        const sanction = new Sanction({
            userID: target.user.id,
            moderatorID: modo.user.id,
            guildID: message.guild.id,
            type: "ban",
            date: new Date(),
            duration: -1,
            reason: (reason)?reason:null,
            finish: false
        });
        sanction.save().then();
        let embed = new Discord.RichEmbed()
            .setColor("#ff0705")
            .setTitle(":hammer:  **Vous avez été ban**");
        if(reason) embed.addField("Raison", (reason)?reason:"Aucune");
        embed.addField("Serveur", message.guild.name, true)
            .addField("Modérateur", modo.displayName, true)
            .addField("Durée", "Permanent", true)
            .setTimestamp(new Date());
        target.user.send(embed).catch((error) => {});
        target.ban(reason).then(() => {
            message.delete();
            message.channel.send(`:hammer: ${target} à été ban par ${message.member}` + ((reason)?` pour : `+"`"+reason+"`":''));
            let log = new Discord.RichEmbed()
                .setColor("#ff0705")
                .setAuthor("BAN | "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL);
            if(reason) log.addField("Raison", (reason)?reason:"Aucune");
            log.addField("Modérateur", modo.displayName, true)
                .addField("Durée", "Permanent", true)
                .setTimestamp(new Date());
            message.guild.channels.get(client.modoLogID).send(log);
        }).catch(() => {
            message.channel.send(":x: Vous n'avez pas la permisson suiffisante de ban ce membre").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        });
    });
};


exports.info = {
    aliases: [],
    description: "Ban un membre",
    usage: "[mention] (raison)",
    category: "Modération",
    permissions: "MANAGE_NICKNAMES",
    showHelp: true
};
