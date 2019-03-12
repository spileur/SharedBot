exports.run = (client, message, args) =>{
    let music = require("./play").musicDispatcher[message.guild.id];
    if(music && music.dispatcher){
        music.queue = [];
        music.dispatcher.end();
    }else{
        message.channel.send(":x: Il n'y a pas de musique lancer");
    }
};

exports.info = {
    aliases: [],
    description: "Arrêter la musique",
    usage: "",
    category: "Musique",
    permissions: "",
    showHelp: true
};
