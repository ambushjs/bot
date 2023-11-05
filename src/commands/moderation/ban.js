module.exports = {
    name: 'ban',
    description: 'Ban a user.',
    options: [
        {
            name: 'user',
            description: 'The user to be banned.',
            type: 6,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for ban.',
            type: 3,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();

        const user = await interaction.guild.members.fetch(interaction.options.get('user').value);

        const { position: targetRole } = user.roles.highest;
        const { position: requestRole } = interaction.member.roles.highest;
        const { position: botRole } = interaction.guild.members.me.roles.highest;

        if (!interaction.member.permissions.has(4n)) {
            return interaction.editReply("You don't have the permission to ban members.");
        }

        if (targetRole >= requestRole || targetRole >= botRole || user.id === client.user.id) {
            return interaction.editReply('Cannot ban the provided user.');
        }

        try {
            user.ban({ reason: interaction.options.get('reason')?.value });
            interaction.editReply(`<@${user.id}> has been banned.`);
        } catch(error) {
            interaction.editReply('Error occurred.');
            console.error(error);
        }
    },
};
