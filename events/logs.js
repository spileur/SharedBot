const Discord = require('discord.js');
const moment = require('moment');

module.exports = (client) => {
    client.on('guildMemberAdd', async member => {
        let log = new Discord.RichEmbed()
            .setColor(4504882)
            .setAuthor(member.user.username, member.user.avatarURL)
            .setDescription(member + " à rejoint le discord")
            .addField('Création du compte', moment(member.user.createdAt).format('DD/MM/YYYY HH:mm:ss'), true)
            .addField('ID', member.user.id, true)
            .setTimestamp(new Date());
        if(member.guild.channels.find((channel) => channel.name === "logs"))member.guild.channels.find((channel) => channel.name === "logs").send(log);
    });

    client.on('guildMemberRemove', async member => {
        const entryBan = await member.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
        let userBan;
        if (entryBan != null
            && entryBan.target.id === member.id
            && (entryBan.createdTimestamp > (Date.now() - 5000))) {
            userBan = entryBan.executor
        }
        const entryKick = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'}).then(audit => audit.entries.first());
        let userKick;
        if (entryKick != null
            && entryKick.target.id === member.id
            && (entryKick.createdTimestamp > (Date.now() - 5000))) {
            userKick = entryKick.executor
        }
        if(userBan != null){
            let log = new Discord.RichEmbed()
                .setColor(16711680)
                .setAuthor(userBan.username, userBan.avatarURL)
                .setDescription(userBan + " a banni " + member + " du serveur")
                .addField('Raison', (entryBan.reason != null)?entryBan.reason:'Aucune')
                .addField("Date d\'arrivée", moment(member.joinedAt).format('DD/MM/YYYY HH:mm:ss'),true)
                .addField("ID", member.user.id, true)
                .setTimestamp(entryBan.createdAt);
            if(member.guild.channels.find((channel) => channel.name === "logs"))member.guild.channels.find((channel) => channel.name === "logs").send(log);
        }else if(userKick != null){
            let log = new Discord.RichEmbed()
                .setColor(16711680)
                .setAuthor(userKick.username, userKick.avatarURL)
                .setDescription(userKick + " a expulsé " + member + " du serveur")
                .addField('Raison', (entryKick.reason != null)?entryKick.reason:'Aucune')
                .addField("Date d\'arrivée", moment(member.joinedAt).format('DD/MM/YYYY HH:mm:ss'),true)
                .addField("ID", member.user.id, true)
                .setTimestamp(entryKick.createdAt);
            if(member.guild.channels.find((channel) => channel.name === "logs"))member.guild.channels.find((channel) => channel.name === "logs").send(log);
        }else{
            let log = new Discord.RichEmbed()
                .setColor(16711680)
                .setAuthor(member.user.username, member.user.avatarURL)
                .setDescription(member + " à quitté le discord")
                .addField("Date d\'arrivée", moment(member.joinedAt).format('DD/MM/YYYY HH:mm:ss'),true)
                .addField("ID", member.user.id, true)
                .setTimestamp(new Date());
            if(member.guild.channels.find((channel) => channel.name === "logs"))member.guild.channels.find((channel) => channel.name === "logs").send(log);
        }
    });

    client.on('messageUpdate', async function(oldMessage, newMessage) {
        if(oldMessage.content !== newMessage.content && !newMessage.author.bot){
            let log = new Discord.RichEmbed()
                .setColor(16753920)
                .setAuthor(newMessage.author.username, newMessage.author.avatarURL)
                .setDescription(newMessage.author + " a modifié son message")
                .addField('Ancien Message', (oldMessage && oldMessage.content != null && oldMessage.content !== '')?oldMessage.content:"*Image/Embed*")
                .addField('Nouveau Message', (newMessage.content)?newMessage.content:"*Image/Embed*")
                .addField('ID', newMessage.id, true)
                .addField('Salon', newMessage.channel, true)
                .setTimestamp(new Date());
            if(newMessage.member.guild.channels.find((channel) => channel.name === "logs"))newMessage.member.guild.channels.find((channel) => channel.name === "logs").send(log);
        }
    });

    client.on('messageDelete', async function(message) {
        const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());
        let user;
        if (entry.extra.channel && entry.extra.channel.id === message.channel.id
            && (entry.target.id === message.author.id)
            && (entry.createdTimestamp > (Date.now() - 5000))
            && (entry.extra.count >= 1)) {
            user = entry.executor
        } else {
            user = message.author
        }
        if(user.bot)return;
        if(user === message.author){
            let log = new Discord.RichEmbed()
                .setColor(16711680)
                .setAuthor(user.username, user.avatarURL)
                .setDescription(user + " a supprimé son message")
                .addField('Message', (message.content)?message.content:"*Image/Embed*")
                .addField('ID', message.id, true)
                .addField('Salon', message.channel, true)
                .setTimestamp(new Date());
            if(message.member.guild.channels.find((channel) => channel.name === "logs"))message.member.guild.channels.find((channel) => channel.name === "logs").send(log);
        }else{
            let log = new Discord.RichEmbed()
                .setColor(16711680)
                .setAuthor(user.username, user.avatarURL)
                .setDescription(user + " a supprimé le message de "+ message.author)
                .addField('Message', (message.content)?message.content:"*Image/Embed*")
                .addField('ID', message.id, true)
                .addField('Salon', message.channel, true)
                .setTimestamp(new Date());
            if(message.member.guild.channels.find((channel) => channel.name === "logs"))message.member.guild.channels.find((channel) => channel.name === "logs").send(log);
        }

    });
};
