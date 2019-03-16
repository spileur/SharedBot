const mongoose = require('mongoose');
const Discord = require("discord.js");
const Warn = require('../../models/warn');


exports.run = (client, message, args) =>{
    if(args.length >= 1){
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target){
            let reason = args.join(" ");
            message.delete();
            exports.warn(client, message, target, message.member, reason);
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
            .setDescription(client.config.prefix+'warn [mention] (raison)');
        message.channel.send(help).then((value) => {
            message.delete(5000);
            value.delete(5000);
        });
    }
};


exports.warn = function (client, message, target, modo, reason){
    client.connectDatabase(client, mongoose);
    const warn = new Warn({
        userID: target.user.id,
        moderatorID: modo.user.id,
        guildID: message.guild.id,
        date: new Date(),
        reason: (reason)?reason:null
    });
    warn.save().then((result) => {
        Warn.find({
            userID: target.user.id,
            guildID: message.guild.id
        }, function (err, docs) {
            docs.reverse();
            message.channel.send(`:warning: ${target} a été averti par ${modo}` + ((reason)?` pour : `+"`"+reason+"`":'') + " ("+docs.length+" "+((docs.length > 1)?"warns":"warn")+")");
            let log = new Discord.RichEmbed()
                .setColor("#ffe500")
                .setAuthor("WARN | "+target.user.username+"#"+target.user.discriminator, target.user.avatarURL);
            if(reason) log.addField("Raison", (reason)?reason:"Aucune");
            log.addField("Modérateur", modo.displayName, true)
                .addField("Nombre de Warn(s)", docs.length, true)
                .setTimestamp(new Date());
            message.guild.channels.get(client.modoLogID).send(log);
            let embed = new Discord.RichEmbed()
                .setColor("#ffe500")
                .setTitle(":warning: **Vous avez reçu un avertissement**")
                .setDescription("Les avertissements sont enregistrés et pourront être décisif pour une prise de sanction");
            if(reason) embed.addField("Raison", (reason)?reason:"Aucune");
            embed.addField("Serveur", message.guild.name, true)
                .addField("Modérateur", modo.displayName, true)
                .addField("Nombre de Warn(s)", docs.length, true)
                .addField("ID", docs[0]._id, true)
                .setTimestamp(new Date());
            target.user.send(embed).catch((error) => {});
            mongoose.disconnect();
        });
    }).catch((error) => {
        message.channel.send(":x: Une erreur s'est produit le membre n'a pas pu être averti").then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    });
};

exports.info = {
    aliases: [],
    description: "Avertir un membre",
    usage: "[mention] (raison)",
    category: "Modération",
    permissions: "MANAGE_MESSAGES",
    showHelp: true
};
