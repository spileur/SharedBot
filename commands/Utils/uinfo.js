const Discord = require("discord.js");
const moment = require('moment');

exports.run = (client, message, args) =>{
    let target = message.member;
    if(args.length >= 1)target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
    if(target){
        let avatar = target.user.avatarURL;
        if(!avatar)avatar = "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png?size=2048";
        let rolesListFormat;
        target.roles.forEach(function (role) {
            if (role.name !== '@everyone') {
                if (!rolesListFormat) {
                    rolesListFormat = role;
                } else {
                    rolesListFormat += ', ' + role;
                }
            }
        });
        let ui = new Discord.RichEmbed()
            .setColor(target.displayColor)
            .setAuthor(target.user.username, avatar)
            .addField('Pseudo', target.user.username + '#' + target.user.discriminator, true)
            .addField('Surnom', (target.nickname != null) ? target.nickname : 'Aucun', true)
            .addField('Jeu', (target.user.presence.game != null) ? target.user.presence.game.name : 'Aucun', true)
            .addField('ID', target.id, true)
            .addField('Date d\'arrivée', moment(target.joinedAt).format('DD/MM/YYYY HH:mm:ss'), true)
            .addField('Création du compte', moment(target.user.createdAt).format('DD/MM/YYYY HH:mm:ss'), true)
            .addField('Rôle(s)', (rolesListFormat)?rolesListFormat:"Aucun")
            .setThumbnail(avatar)
            .setTimestamp(new Date());
        message.channel.send(ui);
    }else{
        message.channel.send(":x: Le membre est introuvable");
    }
};

exports.info = {
    aliases: ["userstats"],
    description: "Afficher les informations sur un membre",
    usage: "(mention)",
    category: "Utils",
    permissions: "",
    showHelp: true
};
