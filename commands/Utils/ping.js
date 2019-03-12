exports.run = (client, message, args) =>{
    message.channel.send(":ping_pong: Pong ! (" + Math.round(client.ping) + " ms)");
};

exports.info = {
    aliases: ["ms"],
    description: "Afficher le ping du bot",
    usage: null,
    category: "Utils",
    permissions: null,
    showHelp: true
};
