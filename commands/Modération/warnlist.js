const mongoose = require('mongoose');
const Discord = require("discord.js");
const Warn = require('../../models/warn');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

exports.run = (client, message, args) =>{
    if(args.length >= 1){
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target){
            client.connectDatabase(client, mongoose);

            Warn.find({
                userID: target.user.id,
                guildID: message.guild.id
            }, function (err, docs) {
                if(err) return console.log(err);
                if(docs.length <= 0) return message.channel.send(":x: Le membre n'a aucun avertissement");
                let embed = new Discord.RichEmbed()
                    .setColor("#ffe500")
                    .setAuthor("Avertissements de "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL)
                    .setDescription(docs.length + " avertissement(s)")
                    .setTimestamp(new Date());
                let warnsText;
                let i = 0;
                docs.reverse();
                docs.forEach((warn) => {
                    if(i >= 10) return false;
                    i++;
                    let time = Date.now()-warn.date.getTime();
                    if(warnsText){
                        warnsText += "\n● "+((warn.reason)?"**"+warn.reason+"**":"*Aucune raison*") + " - par "+ ((client.users.get(warn.moderatorID))?client.users.get(warn.moderatorID).username:warn.moderatorID)
                            + " - " + moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1});
                    }else{
                        warnsText = "● "+((warn.reason)?"**"+warn.reason+"**":"*Aucune raison*") + " - par "+ ((client.users.get(warn.moderatorID))?client.users.get(warn.moderatorID).username:warn.moderatorID)
                            + " - " + moment.duration(time, "milliseconds").format("y [ans], w [semaines], d [jours], h [heures], m [minutes], s [secondes]", {largest: 1});
                    }
                });
                embed.addField("Les 10 derniers avertissements", warnsText);
                message.channel.send(embed);
                mongoose.disconnect();
            });
        }else{
            message.channel.send(":x: Le membre est introuvable").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        }
    }else{
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'warnlist [mention]');
        message.channel.send(help).then((value) => {
            message.delete(5000);
            value.delete(5000);
        });
    }
};

exports.info = {
    aliases: ["warnslist", "seewarn", "seewarns", "warns"],
    description: "Voir les avertissements d'un membre",
    usage: "[mention]",
    category: "Modération",
    permissions: "MANAGE_MESSAGES",
    showHelp: true
};
