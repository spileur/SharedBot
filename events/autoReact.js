module.exports = (client) => {

    let pollChannelID = '555449824070205463';
    let likeEmojiID = '555810810337820702';
    let dislikeEmojiID = '555810848975618048';

    client.on('message', async (message) => {
        if(message.channel.type !== "text")return;
        if(message.channel === pollChannelID){
            let emojis = message.guild.emojis;
            message.react(emojis.get(likeEmojiID)).then(() => {
               message.react(emojis.get(dislikeEmojiID));
            });
        }
    });

};