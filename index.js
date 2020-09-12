const discord = require("discord.js");
const client = new discord.Client();

client.on("ready", () => {
    console.log(`Connected to Discord as ${client.user.tag}.`);
});

client.on("message", (msg) => {

    if(msg.author.bot || msg.webhookID) return;
    if(!msg.content) return;

    const args = msg.content.split(" ");
    const cmd = args.shift().toLowerCase();

    require("./commands/help.js")(discord, client, msg, args, cmd);
    require("./commands/sync.js")(discord, client, msg, args, cmd);

});

client.login(require("./config.json").token);