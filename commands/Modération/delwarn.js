const mongoose = require('mongoose');
const Discord = require("discord.js");
const Warn = require('../../models/warn');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

exports.run = (client, message, args) =>{
    if(args.length >= 2){
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        args.shift();
        if(target){
            client.connectDatabase(client, mongoose);
            if(args[0].toLowerCase() === "all") {
                Warn.deleteMany({
                    userID: target.user.id,
                    guildID: message.guild.id
                }, function (err) {
                    if (err) console.log(err);
                    message.channel.send(":scales: Tous les warns de " + target + " ont été supprimer par "+message.member);
                    mongoose.connection.close();
                });
            }else{
                let i = parseInt(args[0]);
                if(i > 0){
                    Warn.find({
                        userID: target.user.id,
                        guildID: message.guild.id
                    }, function (err, docs) {
                        if(err)console.log(err);
                        if(!docs) message.channel.send(":x: Le warn est introuvable").then((value) => {
                            message.delete(10000);
                            value.delete(10000);
                        });
                        docs.reverse();
                        let queryTarget = docs[i-1];
                        if(queryTarget){
                            Warn.deleteOne({
                                _id: queryTarget._id
                            }, function (err) {
                                if(err)console.log(err);
                                message.delete();
                                message.channel.send(":scales: Un warn de " + target + " a été supprimer par "+message.member);
                                mongoose.connection.close();
                            });

                        }else{
                            message.channel.send(":x: Le warn est introuvable").then((value) => {
                                message.delete(10000);
                                value.delete(10000);
                            });
                        }
                    });
                }else{
                    message.channel.send(":x: Vous devez entrer un nombre valide").then((value) => {
                        message.delete(10000);
                        value.delete(10000);
                    });
                }

            }

        }else{
            message.channel.send(":x: Le membre est introuvable").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        }
   /* }else if(args.length >= 1 && args[0].length === 24){
        Warn.findOne({
            _id: args[0],
            guildID: message.guild.id
        }, function (err, docs) {
            if(err)console.log(err);
            if(docs){
                Warn.deleteOne({
                    _id: docs._id
                }, function (err) {
                    if(err)console.log(err);
                    message.channel.send(":white_check_mark: Le warn "+docs._id+" a bien été supprimer");
                    mongoose.connection.close();
                });
            }else{
                message.channel.send(":x: Le warn est introuvable").then((value) => {
                    message.delete(10000);
                    value.delete(10000);
                });
            }
        });*/
    }else{
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'delwarn [mention] (numero/all)');
        message.channel.send(help).then((value) => {
            message.delete(5000);
            value.delete(5000);
        });
    }
};

exports.info = {
    aliases: [],
    description: "Supprimer un avertissement à un membre",
    usage: "[mention] (numero/all)",
    category: "Modération",
    permissions: "MANAGE_MESSAGES",
    showHelp: true
};
