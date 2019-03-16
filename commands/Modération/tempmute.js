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
                    message.channel.send(":x: La durée du mute est incorrecte").then((value) => {
                        message.delete(10000);
                        value.delete(10000);
                    });
                    return;
                }
                exports.tempmute(client, message, target, message.member, time, reason);
            }else{
                message.channel.send(":x: Vous n'avez pas la permisson suiffisante de mute ce membre").then((value) => {
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
            .setDescription(client.config.prefix+'tempmute [mention] [temps] (raison)\n Temps : m, h, d, w, mo, y');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.tempmute = function (client, message, target, modo, time, reason){
    client.connectDatabase(client, mongoose);
    let roleMuted = target.guild.roles.find((role) => role.name === "Muted");
    if(roleMuted === undefined){
        message.channel.send(":x: Le role `Muted` est introuvable sur le serveur").then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
        return;
    }
    Sanction.findOne({
        userID: target.user.id,
        guildID: message.guild.id,
        type: "mute",
        finish: false
    }, function(err, doc) {
        if(doc) return message.channel.send(":x: Le membre est déjà mute");
        const sanction = new Sanction({
            userID: target.user.id,
            moderatorID: modo.user.id,
            guildID: message.guild.id,
            type: "mute",
            date: new Date(),
            duration: time,
            reason: (reason)?reason:null,
            finish: false
        });
        sanction.save().then();
        target.addRole(roleMuted , reason).then(() => {
            message.delete();
            message.channel.send(`:hammer: ${target} a été mute par ${message.member}` + " pendant " + moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1}) + ((reason)?` pour : `+"`"+reason+"`":''));
            let log = new Discord.RichEmbed()
                .setColor("#ff5900")
                .setAuthor("TEMPMUTE | "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL);
            if(reason) log.addField("Raison", (reason)?reason:"Aucune");
            log.addField("Modérateur", modo.displayName, true)
                .addField("Durée", moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1}), true)
                .setTimestamp(new Date());
            message.guild.channels.get(client.modoLogID).send(log);
            let embed = new Discord.RichEmbed()
                .setColor("#ff5900")
                .setTitle(":hammer:  **Vous avez été mute**");
            if(reason) embed.addField("Raison", (reason)?reason:"Aucune");
            embed.addField("Serveur", message.guild.name, true)
                .addField("Modérateur", modo.displayName, true)
                .addField("Durée", moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1}), true)
                .setTimestamp(new Date());
            target.user.send(embed).catch((error) => {});
        }).catch(() => {
            message.channel.send(":x: Vous n'avez pas la permisson suiffisante de mute ce membre").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        });
    });
    mongoose.disconnect();
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
    description: "TempMute un membre",
    usage: "[mention] [temps] (raison)",
    category: "Modération",
    permissions: "MANAGE_NICKNAMES",
    showHelp: true
};
