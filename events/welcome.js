const Discord = require("discord.js");

module.exports = (client) => {

    let messageRuleID = '555452549306515456';
    let roleMemberID = '554379619063693315';
    let commandChannelID = '554705911697113124';
    let joinChannelID = '554440221949952010';

    client.on('raw', async event => {
        if (event.t === 'MESSAGE_REACTION_ADD'){
            let emojiId = event.d.emoji.id;
            let channel = client.channels.get(event.d.channel_id);
            let message = channel.fetchMessage(event.d.message_id).then(msg => {
                let member = msg.guild.members.get(event.d.user_id);
                let guild = msg.guild;
                if (msg.id === messageRuleID && !member.roles.exists("id", roleMemberID)){
                    member.addRole(guild.roles.get(roleMemberID));
                    if((guild.memberCount-1) <= 100){
                        member.addRole(guild.roles.find(role => role.name === "Vétéran"));
                    }
                    member.send("Hey, Bienvenue sur le discord de ShareCode !\n" +
                        "Je m'appel "+client.user.username+" et je suis à ta disposition. Tu peux faire `!help` dans "+guild.channels.get(commandChannelID)+" pour afficher la liste des commands.\n" +
                        "À bientôt sur le discord :grinning:");
                    let joinMessage = new Discord.RichEmbed()
                        .setColor('#04a80b')
                        .setAuthor(member.user.username, member.user.avatarURL)
                        .setDescription("**"+member.user.username+"#"+member.user.discriminator+"** a rejoint le serveur. Bienvenue !")
                        .setTimestamp(new Date());
                    guild.channels.get(joinChannelID).send(joinMessage);
                }
            })
        }
    });

    client.on('guildMemberRemove', (member) => {
        let guild = member.guild;
        let leaveMessage = new Discord.RichEmbed()
            .setColor('#e70c0c')
            .setAuthor(user.username, user.avatarURL)
            .setDescription("**"+user.username+"#"+user.discriminator+"** a quitter le serveur. À  bientôt !")
            .setTimestamp(new Date());
        guild.channels.get(joinChannelID).send(leaveMessage);
    });

};