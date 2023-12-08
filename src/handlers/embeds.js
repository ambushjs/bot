const { EmbedBuilder } = require('discord.js');
const ms = require('../../lib/pretty');

module.exports = {
    contactSent(user) {
        return new EmbedBuilder()
            .setTitle('Successfully sent')
            .setDescription('Your message has been sent.')
            .setColor(0x349beb)
            .setTimestamp()
            .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL({ extension: 'png' }),
            });
    },
    contactReceive(user, topic, description) {
        return new EmbedBuilder()
            .setTitle(`New message: ${topic}`)
            .setDescription(description)
            .setColor(0x6434eb)
            .setTimestamp()
            .setFooter({
                text: user.tag,
                iconURL: user.displayAvatarURL({ extension: 'png' }),
            });
    },
    helpHome(user) {
        return new EmbedBuilder()
            .setTitle('Ambush')
            .setDescription('Select 1 or more categories below in the dropdown menu. If you need help with anything, press the `contact` button below.')
            .setColor(0x4287f5)
            .setTimestamp()
            .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL({ extension: 'png' }),
            });
    },
    helpPage(user, value, length) {
        return new EmbedBuilder()
            .setTitle(value)
            .setColor(0x4287f5)
            .setTimestamp()
            .setFooter({
                text: `${length} commands`,
                iconURL: user.displayAvatarURL({ extension: 'png' }),
            });
    },
    helpStats(client, user, stamp) {
        return new EmbedBuilder()
            .setTitle('Statistics')
            .addFields(
                {
                    name: 'Realtime Ping',
                    value: '```yaml' + `\nWebsocket Heartbeat: ${client.ws.ping}ms\nRoundtrip Latency: ${stamp}ms\n\`\`\``,
                },
                {
                    name: 'Uptime',
                    value: '```yaml\nStatus: Online\nUptime: ' + ms(client.uptime) + '```',
                    inline: true,
                },
                {
                    name: 'Owner',
                    value: '```yaml\nDiscord: @thezeptar\nGithub: thezeptar```',
                    inline: true,
                },
                {
                    name: 'Bot Status',
                    value: '```yaml' + `\n- Commands: ${client.commands.size.toString()} commands\n- Servers: ${client.guilds.cache.size} servers\n- Channels: ${client.channels.cache.size} channels\n- Users: ${client.users.cache.size} users\n` + '```',
                }
            )
            .setColor(0x4b9cd3)
            .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL({ extension: 'png' }),
            })
            .setTimestamp();
    },
    compileMain: (user) => {
        return new EmbedBuilder()
            .setTitle('Compile Code')
            .setDescription('To insert code, click the insert code button below. You can keep inserting code multiple times.')
            .setColor(0x4b9cd3)
            .setFooter({
                text: user.username,
                iconURL: user.displayAvatarURL({ extension: 'png' }),
            })
            .setTimestamp();
    },
    fail: (msg) => {
        return new EmbedBuilder()
            .setDescription(msg)
            .setColor(0xfa5f55);
    },
};
