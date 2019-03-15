const Discord = require("discord.js");

exports.run = (client, message, args) =>{
    if(args.length >= 1){
        let num = parseInt(args[0]);
        if(num > 0 && num < 100){
            message.channel.bulkDelete(1+num, true).then((msg) => {
                message.channel.send(new Discord.RichEmbed()
                    .setTitle(num + " messages ont été supprimé :wastebasket:"));
            });
        }else if(num < 0) {
            message.channel.send("Je ne sais pas effacer un nombre négatif de message :smirk:").then((value) => {
                message.delete(5000);
                value.delete(5000);
            });
        }else if(num === 0) {
            message.channel.send("Ok, j'ai effacé 0 message :stuck_out_tongue_closed_eyes:").then((value) => {
                message.delete(5000);
                value.delete(5000);
            });
        }else {
            message.channel.send('Pour des raisons de sécurité, vous devez choisir un nombre entre 1 et 99 :no_entry:').then((value) => {
                message.delete(5000);
                value.delete(5000);
            });
        }
    }else{
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix+'purge [nombre]');
        message.channel.send(help).then((value) => {
            message.delete(5000);
            value.delete(5000);
        });
    }
};

exports.info = {
    aliases: ["clear"],
    description: "Effacer les messages d'un channel",
    usage: "[nombre]",
    category: "Modération",
    permissions: "MANAGE_MESSAGES",
    showHelp: false
};
