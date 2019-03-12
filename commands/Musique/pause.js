exports.run = (client, message, args) =>{
    let music = require("./play").musicDispatcher[message.guild.id];
    if(music && music.dispatcher){
        if(!music.dispatcher.paused){
            music.dispatcher.pause();
            message.channel.send(":pause_button: Pause");
        }else{
            message.channel.send(":x: La musique est déjà en pause. Utilise `"+client.config.prefix+"play` pour relacer la musique !");
        }
    }else{
        message.channel.send(":x: Il n'y a aucune musique lancer");
    }
};

exports.info = {
    aliases: [],
    description: "Mettre en pause la musique",
    usage: "",
    category: "Musique",
    permissions: "",
    showHelp: true
};
