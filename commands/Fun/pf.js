exports.run = (client, message, args) =>{
    message.channel.send("Lancement de la pièce :right_facing_fist:").then(result => {
        setTimeout(function(){
            if(getRandomInt(2) === 0){
                result.edit("Pile :open_mouth:");
            }else{
                result.edit("Face :open_mouth:");
            }
        }, 2000);
    });
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

exports.info = {
    aliases: ["coinflip"],
    description: "Pile ou Face !",
    usage: "",
    category: "Fun",
    permissions: "",
    showHelp: true
};
