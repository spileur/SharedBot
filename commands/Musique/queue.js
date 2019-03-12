const Discord = require('discord.js');

exports.run = (client, message, args) =>{
    let music = require("./play").musicDispatcher[message.guild.id];
    if((!music || !music.listening)){
        message.channel.send(":x: Il n'y a pas de musique dans la file d'attente");
    }else{
        let embed = new Discord.RichEmbed()
            .setTitle("File d'attente")
            .setTimestamp(new Date(Date.now()));
        if(music.dispatcher !== null && music.listening !== null){
            embed.addField("En cours de lecture", "[" + music.listening.title + "]("+music.listening.url+") | `" + require("./play").toHHMMSS(music.listening.length) + "` | `Demander par " + music.listening.requested + "`", true);
        }
        if(music.queue !== null && music.queue.length > 0){
            let queueEmbed;
            music.queue.forEach((value) => {
                if(queueEmbed === undefined){
                    queueEmbed = "[" + value.title + "]("+value.url+") | `" + require("./play").toHHMMSS(value.length) + "` | `Demander par " + value.requested + "`";
                }else{
                    queueEmbed += "\n" + "[" + value.title + "]("+value.url+") | `" + require("./play").toHHMMSS(value.length) + "` | `Demander par " + value.requested + "`"
                }
            });
            embed.addField("Musique à venir", queueEmbed);
        }
        message.channel.send(embed);
    }
};

exports.info = {
    aliases: [],
    description: "Voir la file d'attente",
    usage: "",
    category: "Musique",
    permissions: "",
    showHelp: true
};
