module.exports = function (discord, client, msg, args, cmd) {
    
    if(cmd == "s?help") {
        msg.channel.send(new discord.MessageEmbed()
            .setTitle("Help")
            .setDescription("syncrasb synchronizes all RASB bans to this server, to continue support for the discontinued `?sync` command.")
            .addField("s?help", "Displays this message.", true)
            .addField("s?sync", "Synchronizes all RASB bans to this server.", true)
            .setFooter("We are not affiliated with RASB."));
    }

}