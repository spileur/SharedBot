const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');

exports.musicDispatcher = {};

exports.run = (client, message, args) => {
    if(args.length <= 0){
        let music = exports.musicDispatcher[message.guild.id];
        if(music && music.dispatcher && music.dispatcher.paused){
            message.channel.send(':arrow_forward: Play');
            music.dispatcher.resume();
        }else{
            let help = new Discord.RichEmbed()
                .setColor("#FF0000")
                .setTitle('❌')
                .setDescription(client.config.prefix+'play (lien/search)');
            message.channel.send(help).then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        }
    }else{
        let query = args.join(" ");
        message.channel.send(":mag_right: Recherche de `" + query + "`");
        if(!ytdl.validateURL(query)){
            let opts = {
                maxResults: 1,
                key: client.config.api["youtube-api"],
                type: 'video'
            };
            ytsearch(query, opts, function (err, results) {
                if(results.length > 0){
                    exports.launchMusic(results[0].link, client, message, args);
                }else{
                    message.channel.send(":x: Aucun résultat");
                }
            });
        }else{
            exports.launchMusic(query, client, message, args);
        }
    }
};

exports.launchMusic = function launchMusic(url, client, message, args) {
    if(url !== null){
        ytdl.getInfo(url).then(info => {
            if(info !== null){
                let musicJSON = {title: info.title, url: info.video_url, channel: info.author.name, length: info.length_seconds, requested: message.author.username};
                if(!exports.musicDispatcher[message.guild.id]){
                    exports.musicDispatcher[message.guild.id] = {
                        id: message.guild.id,
                        listening: undefined,
                        dispatcher: undefined,
                        songMusicId: undefined,
                        queue: []
                    };
                    let music = exports.musicDispatcher[message.guild.id];
                    music.listening = musicJSON;
                    if(message.member.voiceChannel !== undefined){
                        message.member.voiceChannel.join().then((connection) => {
                            music.songMusicId = message.channel.id;
                            exports.startMusic(client, music);
                        });
                    }else{
                        message.channel.send(":x: Vous devez rejoindre un salon vocal");
                        exports.musicDispatcher[message.guild.id] = undefined;
                    }
                }else{
                    let music = exports.musicDispatcher[message.guild.id];
                    music.queue.push(musicJSON);
                    let embed = new Discord.RichEmbed()
                        .setAuthor("Ajouté à la file d'attente", message.author.avatarURL)
                        .setTitle(info.title)
                        .setURL(info.video_url)
                        .setThumbnail(info.thumbnail_url)
                        .addField("Chaîne", info.author.name, true)
                        .addField("Durée", exports.toHHMMSS(info.length_seconds), true)
                        .addField("Demander par", message.author.username, true)
                        .addField("Position", music.queue.indexOf(musicJSON)+1, true)
                        .setTimestamp(new Date(Date.now()));
                    message.channel.send(embed);
                }
            }else{
                message.channel.send(":x: Aucun résultat");
            }
        });
    }else{
        message.channel.send(":x: Aucun résultat");
    }
};

exports.startMusic = function startMusic(client, music){
    music.dispatcher = client.voiceConnections.get(music.id).playStream(ytdl(music.listening.url, { filter: 'audioonly' }));
    client.guilds.get(music.id).channels.get(music.songMusicId).send(":notes: Lecture de `" + ((music.listening.title === null)?"null":music.listening.title+"") +"`");
    music.dispatcher.on('error', () => {
        music.listening = null;
        client.guilds.get(music.id).channels.get(music.songMusicId).send(":x: Cette musique est protégée par Youtube");
        exports.nextMusic(client, music);
    });
    music.dispatcher.on('end', () => {
        music.listening = undefined;
        exports.nextMusic(client, music);
    });
};

exports.nextMusic = function nextMusic(client, music) {
    music.listening = undefined;
    if(music.queue && music.queue.length > 0){
        music.listening = music.queue.shift();
        exports.startMusic(client, music);
    }else{
        client.voiceConnections.get(music.id).disconnect();
        client.guilds.get(music.id).channels.get(music.songMusicId).send(":stop_button: Fin de la musique !");
        exports.musicDispatcher[music.id] = undefined;
    }
};

exports.toHHMMSS = function toHHMMSS(time) {
    var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}


exports.info = {
    aliases: ["p", "add"],
    description: "Lancer/Ajouter une musique",
    usage: "(lien/search)",
    category: "Musique",
    permissions: null,
    showHelp: true
};
