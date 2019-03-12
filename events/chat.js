let spam = {};

let warnBuffer = 4;
let maxBuffer = 8;
let inverval = 2000;
let invervalKick = 4500;
let maxDuplicatesWarning = 3;
let permission = "MENTION_EVERYONE";

module.exports = (client) => {
    client.on('message', async (message) => {
        if(message.channel.type !== "text")return;
        if((message.member && message.member.hasPermission(permission)) || client.config.byPassPermission.includes(message.author.id) || message.author.bot)return;
        let reason;
        if(checkInvitation(message)) reason = checkInvitation(message);
        if(checkUrl(message)) reason = checkUrl(message);
        if(checkWarnWords(message)) reason = checkWarnWords(message);
        if(checkUpperCase(message)) reason = checkUpperCase(message);
        if(checkMassMention(message)) reason = checkMassMention(message);
        if(checkZalgo(message)) reason = checkZalgo(message);
        if(reason){
            message.delete();
            client.commands.get("warn").warn(client, message, message.member, message.guild.me, reason);
            return true;
        }

        //SPAM
        if(!spam[message.guild.id])spam[message.guild.id] = [];
        if(!spam[message.guild.id][message.author.id]) spam[message.guild.id][message.author.id] = [];
        if(spam[message.guild.id][message.author.id].length > 0 && spam[message.guild.id][message.author.id][0]+inverval < Date.now() && spam[message.guild.id][message.author.id].length < 4) spam[message.guild.id][message.author.id] = [];
        if(spam[message.guild.id][message.author.id].length >= 4 && spam[message.guild.id][message.author.id][0]+invervalKick < Date.now()) spam[message.guild.id][message.author.id] = [];
        spam[message.guild.id][message.author.id].push(Date.now());
        if(spam[message.guild.id][message.author.id].length === 4){
            client.commands.get("warn").warn(client, message, message.member, message.guild.me, "Spam / PROCHAIN WARN = KICK");
        }
        if(spam[message.guild.id][message.author.id].length >= 8){
            client.commands.get("kick").kick(client, message, message.member, message.guild.me, "Spam");
            spam[message.guild.id][message.author.id] = [];
        }
    });
};

function checkInvitation(message) {
    if(message.channel.id === ("481194913426440193" || "537009909246722049")) return false;
    const words = ['discord.gg/', 'discordapp.com/invite/'];
    let include = false;
    words.forEach((word) => {
        if(message.content.toLowerCase().includes(word)){ include = true;}
    });
    return (include)?"Envoi d'invitation discord":false;
}

function checkUrl(message) {
    const warnWords = ["http://", "https://", "www."];
    if(message.channel.permissionsFor(message.member) && message.channel.permissionsFor(message.member).has("EMBED_LINKS"))return false;
    let include = false;
    warnWords.forEach((word) => {
        if(message.content.toLowerCase().includes(word)){ include = true;}
    });
    return (include)?"Envoi de lien":false;
}

function checkWarnWords(message) {
    const warnWords = ["tg", "fdp", "connard", "ta gueule", "nazi", "ftg", "ntm", "pute", "salope", "baise", "suce", "hitler", "nique", "ta mère", "ta mere", "enculé", "encule", "enculer", "branle", "couilles", "gay", "homosexuel"];
    let include = false;
    warnWords.forEach((word) => {
        if(message.content.toLowerCase().startsWith(word + " ") || message.content.toLowerCase().endsWith(" " + word) || message.content.toLowerCase().includes(" " + word+ " ") ||
            (message.content.toLowerCase().startsWith(word ) && message.content.toLowerCase().endsWith(word))){
            include = true;
        }
    });
    return (include)?"Langage incorrect":false;
}

function checkUpperCase(message) {
    const maxUpperCase = 5;
    let upperI = 0;
    for (let i = 0; i < message.content.length; i++) {
        let chr = message.content.charAt(i);
        if(/[A-Z]|[\u0080-\u024F]/.test(chr) && chr === chr.toUpperCase())upperI++;
        else upperI--;
    }
    return (upperI >= maxUpperCase)?"Message en majuscules":false;
}

function checkMassMention(message) {
    const maxMention = 5;
    let i = 0;
    if(message.mentions.everyone)return (i >= maxMention)?"Mention inutile":false;
    i += message.mentions.members.array().length;
    i += message.mentions.roles.array().length;
    return (i >= maxMention)?"Mention inutile":false;
}

function checkZalgo(message) {
    /*const regex = new RegExp("[/[^\x20-\x7E]/");
    return ((regex.test(message.content))?"Utilisation de Zalgo":false);*/
}