const Discord = require("discord.js");

exports.run = (client, message, args) =>{

    let ticketChannelID = '556254015801917470';

    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support")) return message.channel.send(":x: Le rôle `Support` est introuvable. Merci de contacter l'administrateur pour résoudre cette erreur !");
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`:x: Tu as déja un ticket \`d'ouvert\``);
    message.guild.createChannel(`ticket-${message.author.id}`, "text", [{
        id: message.guild.id,
        deny: ['READ_MESSAGES']
    }]).then(channel => {
        let supportTeam = message.guild.roles.find("name", "Support");
        channel.setParent(ticketChannelID);
        channel.setTopic("Membre : "+message.member+" | Créé le "+moment(new Date()).format('DD/MM/YYYY HH:mm:ss'));
        channel.overwritePermissions(supportTeam, { READ_MESSAGES: true });
        channel.overwritePermissions(message.author, { READ_MESSAGES: true });
        message.channel.send(`:white_check_mark: Ton ticket a bien été créé, rend toi dans ${channel}`);
        const embed = new Discord.RichEmbed()
            .setColor("#2D66B8")
            .setAuthor(`Hey ${message.author.username} !`)
            .setDescription("Merci d'expliquer en détail la raison de ton ticket. Notre équipe de "+supportTeam+" sera là le plus vite possible pour te répondre. \nUne fois que le ticket a été résolu utilise la commande `"+client.config.prefix+"close` pour fermer le ticket.")
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
