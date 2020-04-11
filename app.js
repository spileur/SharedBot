const fs = require("fs");
const path = require("path");
const Enmap = require("enmap");
const Discord = require("discord.js");
const client = new Discord.Client();
const mongoose = require('mongoose');

client.config = require("./config.json");
client.commands = new Enmap();
client.modoLogID = '554436602827374612';


console.log("Connnection au serveur discord...");
client.on('ready', async () => {

    connectDatabase(client, mongoose);

    fs.readdir(path.join(__dirname, "commands"), (err, files) => {
        if (err) return console.error(err);
        registerCommand(path.join(__dirname, "commands"), files);
    });

    fs.readdirSync(path.join(__dirname, "events")).forEach(function(file) {
        require('./events/' + file)(client);
    });

    console.log("Le bot est connecter");
});

function registerCommand(pathFile, files) {
    files.forEach(file => {
        if(fs.lstatSync(path.join(pathFile.toLocaleString(), file)).isDirectory()){
            fs.readdir(path.join(pathFile.toLocaleString(), file), (err, files) => {
                registerCommand(path.join(pathFile.toLocaleString(), file), files);
            });
        }else{
            if (!file.endsWith(".js")) return;
            let props = require(`${pathFile}/${file}`);
            let commandName = file.split(".")[0];
            props.command = commandName;
            client.commands.set(commandName, props);
        }
    });

}

function connectDatabase(client, mongoose) {
    mongoose.connect("mongodb+srv://"+client.config.bdd.user+":"+process.env.MONGODB_PASSWORD+"@"+client.config.bdd.url+"/"+client.config.bdd.database, { useNewUrlParser: true }).then();
    client.mongoose = mongoose;
};

client.login(process.env.TOKEN);


