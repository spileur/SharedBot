const Discord = require("discord.js");

exports.run = (client, message, args) =>{
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support")) return message.channel.send(":x: Le rôle `Support` est introuvable. Merci de contacter l'administrateur pour résoudre cette erreur !");
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`:x: Tu as déja un ticket \`d'ouvert\``);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(channel => {
        let supportTeam = message.guild.roles.find("name", "Support");
        let everyone = message.guild.roles.find("name", "@everyone");
        channel.overwritePermissions(supportTeam, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        channel.overwritePermissions(everyone, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        channel.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Ton ticket a bien été créé, rend toi dans ${channel}`);
        const embed = new Discord.RichEmbed()
            .setColor("#2D66B8")
            .setAuthor(`Hey ${message.author.username} !`)
            .setDescription("Merci d'expliquer en détail la raison de ton ticket. Notre équipe de support sera là le plus vite possible pour te répondre. \nUne fois que le ticket a été résolu utilise la commande `"+client.config.prefix+"close` pour fermer le ticket.")
            .setTimestamp(new Date());
        channel.send(embed);
    }).catch(console.error);
};

exports.info = {
    aliases: ["new"],
    description: "Créer un ticket",
    usage: "",
    category: "Utils",
    permissions: "",
    showHelp: true
};
