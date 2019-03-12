const mongoose = require('mongoose');
const Discord = require("discord.js");
const Warn = require('../../models/warn');

exports.run = (client, message, args) =>{
    if(args.length >= 2){
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        if(target === message.member) return message.channel.send(":x: Vous ne pouvez pas vous signaler vous-même");
        args.shift();
        if(target){
            let reason = args.join(" ");
            let attachments = [];
            message.attachments.forEach((attachment) => {attachments.push(attachment.url)});
            let reports = new Discord.RichEmbed()
                .setColor("#7385D3")
                .setAuthor("Report", "https://i.imgur.com/XeWJtCE.png")
                .setDescription("Nouveau report par "+message.author.username+"#"+message.author.discriminator)
                .addField("Membre signaler", target.user.username+"#"+target.user.discriminator + "\n(" + target.user.id + ")", true)
                .addField("Auteur du report", message.author.username+"#"+message.author.discriminator + "\n(" + message.author.id + ")", true)
                .addField("Raison", reason)
                .setThumbnail(target.user.avatarURL)
                .setTimestamp(new Date());
            if(attachments.length > 0)reports.setImage(attachments[0]);
            message.guild.channels.find((channel) => channel.name === "reports").send(reports).then((msg) => {
                message.delete();
                message.reply("Ton signalement a bien été envoyé aux staffs :white_check_mark:")
            }).catch((error) => message.channel.send(":x: Le channel `#reports` est introuvable").then((value) => {
                message.delete(10000);
                value.delete(10000);
            }));
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
            .setDescription(client.config.prefix+'report [mention] [raison] (pièces jointes)');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.info = {
    aliases: [],
    description: "Signaler un membre",
    usage: "[mention] [raison]",
    category: "Modération",
    permissions: "",
    showHelp: true
};
