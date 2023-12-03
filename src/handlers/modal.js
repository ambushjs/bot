const embeds = require('./embeds');

module.exports = async function handleModal(client, interaction) {
    if (interaction.customId === 'contact') {
        await interaction.deferReply({ ephemeral: true });

        const topic = interaction.fields.getTextInputValue('topic');
        const description = interaction.fields.getTextInputValue('description');

        await interaction.editReply({
            embeds: [embeds.contactSent(interaction.user)],
        });

        return client.users.cache.get('1094120827601047653').send({
            embeds: [embeds.contactReceive(interaction.user, topic, description)],
        });
    }
};
