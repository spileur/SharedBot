const mongoose = require('mongoose');
const Discord = require("discord.js");
const Sanction = require('../../models/sanction');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");

exports.run = (client, message, args) =>{
    if (args.length > 1) {
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target) {
            if(target.highestRole.calculatedPosition < message.member.highestRole.calculatedPosition){
                let time = getTemps(args.shift());
                let reason = (args.length > 0)?args.join(" "):undefined;
                if(!time || time === -1){
                    message.channel.send(":x: La durée du ban est incorrecte").then((value) => {
                        message.delete(10000);
                        value.delete(10000);
                    });
                    return;
                }
                exports.tempban(client, message, target, message.member, time, reason);
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
            .setDescription(client.config.prefix+'tempban [mention] [temps] (raison)\n Temps : m, h, d, w, mo, y');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.tempban = function (client, message, target, modo, time, reason){
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
            duration: time,
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
            .addField("Durée", moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1}), true)
            .setTimestamp(new Date());
        target.user.send(embed).catch((error) => {});
        target.ban(reason).then(() => {
            message.delete();
            message.channel.send(`:hammer: ${target} a été ban par ${message.member}` + " pendant " + moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1}) + ((reason)?` pour : `+"`"+reason+"`":''));
            let log = new Discord.RichEmbed()
                .setColor("#ff1513")
                .setAuthor("TEMPBAN | "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL);
            if(reason) log.addField("Raison", (reason)?reason:"Aucune");
            log.addField("Modérateur", modo.displayName, true)
                .addField("Durée", moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1}), true)
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

function getTemps(temps){
    switch (temps.charAt(temps.length-1)) {
        case "m" :
            temps.replace("m", "");
            return (parseInt(temps))?1000 * 60 * parseInt(temps):-1;
        case "h" :
            temps.replace("h", "");
            return (parseInt(temps))?1000 * 60 * 60 * parseInt(temps):-1;
        case "d" :
            temps.replace("d", "");
            return (parseInt(temps))?1000 * 60 * 60 * 24 * parseInt(temps):-1;
        case "w" :
            temps.replace("w", "");
            return (parseInt(temps))?1000 * 60 * 60 * 24 * 7 * parseInt(temps):-1;
        case "mo" :
            temps.replace("mo", "");
            return (parseInt(temps))?1000 * 60 * 60 * 24 * 30 * parseInt(temps):-1;
        case "y" :
            temps.replace("y", "");
            return (parseInt(temps))?1000 * 60 * 60 * 24 * 30 * 12 * parseInt(temps):-1;
        default:
            return -1;
    }
}

exports.info = {
    aliases: [],
    description: "TempBan un membre",
    usage: "[mention] [temps] (raison)",
    category: "Modération",
    permissions: "MANAGE_NICKNAMES",
    showHelp: true
};
