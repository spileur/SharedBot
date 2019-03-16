const Discord = require("discord.js");
let category = ["Administration", "Modération", "Musique", "Utils", "Fun"];


exports.run = (client, message, args) =>{
    let embed = new Discord.RichEmbed()
        .setColor("#3498db")
        .setAuthor("Commands", client.user.avatarURL)
        .setTimestamp(new Date())
        .setFooter("SharedCode");
    category.forEach((category) => {
        let categoryValue;
        client.commands.array().filter(value => value.info !== undefined)
            .filter(value => value.info.category !== undefined)
            .filter(value => value.info.category === category).forEach((command) =>{
                if(command.info.permissions && !client.config.byPassPermission.includes(message.author.id) && !message.member.hasPermission(command.info.permissions))return;
                if(!command.info.showHelp)return;
                let content = "**\\" + client.config.prefix + command.command + ((command.info.usage)?" "+command.info.usage:"") + "** : " + command.info.description;
                if(categoryValue) categoryValue += "\n" + content;
                else categoryValue = content;
            }
        );
        if(categoryValue)embed.addField(category, categoryValue);
    });
    message.author.send(embed).then((msg) => message.react("👍")).catch((error) => {
        message.channel.send(":x: Vous devez activer les messages privés sur ce serveur");
    });
};

exports.info = {
    aliases: ["commands"],
    description: "Liste des commands du bot",
    usage: "",
    category: "Utils",
    permissions: "",
    showHelp: true
};
