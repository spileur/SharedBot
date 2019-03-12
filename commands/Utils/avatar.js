exports.run = (client, message, args) =>{
    let noAvatar = "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png";
    if(args.length <= 0){
        message.channel.send((message.author.avatarURL)?message.author.avatarURL:noAvatar);
    }else{
        let target = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));
        if(target){
            message.channel.send((target.user.avatarURL)?target.user.avatarURL:noAvatar);
        }else{
            message.channel.send(":x: Le membre est introuvable").then((value) => {
                message.delete(10000);
                value.delete(10000);
            });
        }
    }
};

exports.info = {
    aliases: ["pp"],
    description: "Afficher l'avatar d'un membre",
    usage: "(mention)",
    category: "Utils",
    permissions: "",
    showHelp: true
};
