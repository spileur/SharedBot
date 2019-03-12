const mongoose = require('mongoose');
const Discord = require("discord.js");
const Sanction = require('../../models/sanction');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

exports.run = (client, message, args) =>{
    if(args.length >= 1){
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target){
            message.channel.send(":soon: Cette commande n'est pas encore disponible");
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
            .setDescription(client.config.prefix+'sanction [mention]');
        message.channel.send(help).then((value) => {
            message.delete(5000);
            value.delete(5000);
        });
    }
};

exports.info = {
    aliases: ["infractions", "sanctions"],
    description: "Voir toutes les sanctions",
    usage: "[mention/id]",
    category: "Modération",
    permissions: "MANAGE_NICKNAMES",
    showHelp: true
};
