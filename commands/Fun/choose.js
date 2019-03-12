const Discord = require("discord.js");

exports.run = (client, message, args) =>{
    let choose = args.join(" ").split("/");
    if(choose.length > 1) {
        message.channel.send("Je réfléchis :thinking:").then(result => {
            setTimeout(function () {
                let random = getRandomInt(choose.length);
                result.edit("Mon choix est **" + (choose[random].startsWith(" ")?replaceAt(choose[random], 0, ""):choose[random]) +"**");
            }, 3000);
        });
    }else{
        let help = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setTitle('❌')
            .setDescription(client.config.prefix + 'choose [choix1]/[choix2]');
        message.channel.send(help).then((value) => {
            message.delete(10000);
            value.delete(10000);
        });
    }
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function replaceAt(str, index, char) {
    let a = str.split("");
    a[index] = char;
    return a.join("");
}

exports.info = {
    aliases: [],
    description: "Je fais mon choix",
    usage: "[choix1]/[choix2]",
    category: "Fun",
    permissions: "",
    showHelp: true
};
