module.exports = (client) => {
    client.on('message', async (message) => {
        if (message.author.bot) return;
        if(message.channel.type !== "text")return;
        if (message.content.indexOf(client.config.prefix) !== 0) return;
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const commandFile = client.commands.get(command);
        if (commandFile){
            run(commandFile, client, message, args);
        }else{
            client.commands.array().forEach(element => {
                if(element.info && element.info.aliases && element.info.aliases.includes(command)){
                    run(element, client, message, args);
                }
            });
        }
        
    });

    function run(file, client, message, args){
        if(!file.info)return;
        if(!file.info.permissions || client.config.byPassPermission.includes(message.author.id) || message.member.hasPermission(file.info.permissions)){
            file.run(client, message, args);
        }else{
            message.channel.send(":x: Tu n'as pas la permission suffisante pour effectuer cette action").then(target => {
                message.delete(1e4);
                target.delete(1e4);
            });
        }
    }
};