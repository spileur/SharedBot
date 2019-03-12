exports.run = (client, message, args) =>{
    if (!message.channel.name.startsWith(`ticket-`)) return;
    message.channel.send(`Tu es sûr ? Une fois confirmée, tu ne pourras pas retourner en arrière !\nPour confirmer, Appuie sur ✅. Ce délai expire dans 20 secondes.`)
        .then((m) => {
            m.react('✅');
            m.awaitReactions((reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id, {
                max: 1,
                time: 20000,
                errors: ['time'],
            })
                .then((collected) => {
                    message.channel.delete();
                })
                .catch(() => {
                    m.delete();
                });
        });
};

exports.info = {
    aliases: [],
    description: "Fermer un ticket",
    usage: "",
    category: "Utils",
    permissions: "",
    showHelp: false
};
