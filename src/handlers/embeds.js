const { EmbedBuilder } = require('discord.js');

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
    fail: new EmbedBuilder()
        .setDescription('This interaction is not created and usable by you.')
        .setColor(0xfa5f55),
};
