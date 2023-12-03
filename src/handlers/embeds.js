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
    helpHome(interaction) {
        return new EmbedBuilder()
            .setTitle('Floriferous')
            .setDescription('Select 1 or more categories below in the dropdown menu. If you need help with anything, press the `contact` button below.')
            .setColor(0x4287f5)
            .setTimestamp()
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
            });
    },
    helpPage(interaction, value) {
        return new EmbedBuilder()
        .setTitle(value)
        .setColor(0x4287f5)
        .setTimestamp()
        .setFooter({
            text: `${commands.length} commands`,
            iconURL: interaction.user.displayAvatarURL({ extension: 'png' }),
        });
    }
};
