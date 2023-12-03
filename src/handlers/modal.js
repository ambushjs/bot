const embeds = require('./embeds');

module.exports = async function handleModal(client, interaction) {
    if (interaction.customId === 'contact') {
        await interaction.deferReply({ ephemeral: true });

        const topic = interaction.fields.getTextInputValue('topic');
        const description = interaction.fields.getTextInputValue('description');

        await interaction.editReply({
            embeds: [embeds.contactSent(interaction.user)],
        });

        return client.owner.send({
            embeds: [embeds.contactReceive(interaction.user, topic, description)],
        });
    }
};
