const Discord = require("discord.js");

exports.run = (client, message, args) =>{
    if(args.length >= 1){
        let target = args.join(" ");
        let embedObject = (new Function("return " + target+ ";")());
        message.channel.send(new Discord.RichEmbed((embedObject)));
    }else{
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'embed [embed]');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

exports.info = {
    aliases: [],
    description: "Envoyer un message embed",
    usage: "[embed]",
    category: "Administration",
    permissions: "ADMINISTRATOR",
    showHelp: true
};
