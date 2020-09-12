const got = require("got");

module.exports = function (discord, client, msg, args, cmd) {
    
    if(cmd == "s?sync") {
        if(msg.member.hasPermission("ADMINISTRATOR")) {
            if(msg.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
                got("https://www.rasb.xyz/api/bans").then((res) => {
                    const allBans = JSON.parse(res.body).discord;
                    var bans = [];

                    // Remove double bans
                    allBans.forEach(function(ban, i) {
                        if(!bans.includes(ban.id)) {
                            bans.push(ban.id);
                        }
                    });

                    msg.channel.send(new discord.MessageEmbed()
                        .setTitle("Almost there")
                        .setDescription(`If you synchronize all bans, \`${bans.length}+\` users will be banned. This acction is irreversible.\n\nIf you are sure, respond to this message with \`yes\`. Type anything else or wait 10s to cancel.`)
                        .setFooter("We are not affiliated with RASB."));

                    msg.channel.awaitMessages(m => m.author == msg.author, {max: 1, time: 10000, errors: ["time"]})
                        .then((collected) => {
                            if(collected.first().content == "yes") {
                                msg.channel.send(new discord.MessageEmbed()
                                    .setTitle("Syncing")
                                    .setDescription(`Time Left (estimate): \`${Math.round(bans.length*2/60)}min\`\nProgress: \`0/${bans.length} bans\``)
                                    .setFooter("We are not affiliated with RASB.")).then(function(progressMsg) {
                                        bans.forEach((id, i) => {
                                            setTimeout(() => {
                                                msg.guild.members.ban(id, {days: 0, reason: `Unofficial RASB Synchronization (triggered by ${msg.author.id})`}).catch(() => {});
                                                
                                                if(i+1 >= bans.length) {
                                                    progressMsg.edit(new discord.MessageEmbed()
                                                        .setTitle("Bans synced")
                                                        .setDescription(`\`${bans.length} bans\` have been synchronized.`)
                                                        .setFooter("We are not affiliated with RASB."));
                                                } else {
                                                    progressMsg.edit(new discord.MessageEmbed()
                                                        .setTitle("Syncing")
                                                        .setDescription(`Time Left (estimate): \`${Math.round((bans.length-i-1)*2/60)}min\`\nProgress: \`${(i+1)}/${bans.length} bans\``)
                                                        .setFooter("We are not affiliated with RASB."));
                                                }
                                            }, i * 2000);
                                        });
                                    });
                            } else {
                                msg.channel.send(new discord.MessageEmbed()
                                    .setTitle("Prompt cancelled")
                                    .setDescription("The prompt was cancelled successfully. You can start another by running `s?sync`.")
                                    .setFooter("We are not affiliated with RASB."));
                            }
                        })
                        .catch(() => {
                            msg.channel.send(new discord.MessageEmbed()
                                .setTitle("Prompt expired")
                                .setDescription("The synchronization prompt has expired. You can start another by running `s?sync`.")
                                .setFooter("We are not affiliated with RASB."));
                        });
                }).catch((err) => {
                    throw err;
                });
            } else {
                msg.channel.send(new discord.MessageEmbed()
                    .setTitle("Insufficient Permission(s)")
                    .setDescription("The bot requires following permission(s) to run: `BAN_MEMBERS`")
                    .setFooter("We are not affiliated with RASB."));
            }
        } else {
            msg.channel.send(new discord.MessageEmbed()
                .setTitle("Insufficient Permission(s)")
                .setDescription("You do not have the required permission(s) to run this command: `ADMINISTRATOR`")
                .setFooter("We are not affiliated with RASB."));
        }
    }

}