exports.run = (client, message, args) =>{
    if(args.length >= 1){
        let text = args.join(" ");
        message.guild.me.setNickname(text).then((clientUser) => {
            message.channel.send(":gear: Le pseudo du bot est maintenant : `"+ message.guild.me.nickname +"`");
        });
    }else{
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'rename [pseudo]');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.info = {
    aliases: [],
    description: "Changer le pseudo du bot",
    usage: "[pseudo]",
    category: "Administration",
    permissions: "ADMINISTRATOR",
    showHelp: true
};
