module.exports = (client) => {

    let homeChannelID = '554374405619449857';

    client.guilds.forEach((guilds) => {
        updateStatsPlayers(guilds);
    });

    client.on('guildMemberAdd', async member => {
        updateStatsPlayers(member.guild);
    });

    client.on('presenceUpdate', async (oldMember, newMember) => {
        updateStatsPlayers(newMember.guild);
    });

    client.on('guildMemberRemove', async member => {
        updateStatsPlayers(member.guild);
    });

    function updateStatsPlayers(guild) {
        if(guild.id === client.config.serverID){
            let max = guild.memberCount-1;
            let online = guild.members.filter(m => m.presence.status !== 'offline').size-1;
            let formatString = '📌 Information - '+online+'/'+max+' 👥';
            let homeChannel = guild.channels.get(homeChannelID);
            if(homeChannel.name !== formatString){
                homeChannel.setName(formatString).catch(error => {
                    console.log(error);
                });
            }
        }
    }
};