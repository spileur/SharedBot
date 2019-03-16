const mongoose = require('mongoose');
const Discord = require("discord.js");
const Sanction = require('../models/sanction');


module.exports = (client) => {

   client.guilds.forEach((guilds) => {
       guilds.channels.forEach((channels) => {
          channels.overwritePermissions(guilds.roles.find(guild => guild.name === 'Muted'), {SPEAK: false, ADD_REACTIONS: false, SEND_MESSAGES: false});
       });
   });

   client.on('channelCreate', (channel) => {
       if(channel.type === 'dm')return;
       channel.overwritePermissions(channel.guild.roles.find(guild => guild.name === 'Muted'), {SPEAK: false, ADD_REACTIONS: false, SEND_MESSAGES: false});
   });

    client.on("guildMemberAdd", (member) => {
        Sanction.findOne({
            userID: member.user.id,
            guildID: member.guild.id,
            finish: false
        }, function (err, doc) {
            if(doc){
                let roleMuted = member.guild.roles.find((role) => role.name === "Muted");
                if(roleMuted){
                    member.addRole(roleMuted);
                }
            }
        });
    });

    setInterval(function () {
        client.connectDatabase(client, mongoose);
        let nowTime = Date.now();
        Sanction.find({
            finish: false
        }, function (err, docs) {
            if(!docs)return;
            mongoose.disconnect();
            docs.forEach((doc) => {
                if(doc.duration !== -1){
                    if(doc.date.getTime()+doc.duration <= nowTime){
                        doc.finish = true;
                        client.connectDatabase(client, mongoose);
                        doc.save(mongoose.disconnect());
                        if(client.guilds.get(doc.guildID)){
                            let guild = client.guilds.get(doc.guildID);
                            if(doc.type === "mute" && guild.members.get(doc.userID)){
                                let member = guild.members.get(doc.userID);
                                let roleMuted = guild.roles.find((role) => role.name === "Muted");
                                if(roleMuted){
                                    member.removeRole(roleMuted, "tempmute finish");
                                }
                            }else if(doc.type === "ban"){
                                guild.unban(doc.userID, "tempban finish");
                            }
                        }

                    }
                }
            });
        });
    }, 5000);
};