module.exports = {
    name: 'setnick',
    description: 'Set the nickname of a user.',
    options: [
        {
            name: 'user',
            description: 'The user to change nickname.',
            type: 6,
            required: true,
        },
        {
            name: 'name',
            description: 'The nickname to set.',
            type: 3,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for changing nickname.',
            type: 3,
            required: false,
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();

        const name = interaction.options.get('name').value;
        const user = await interaction.guild.members.fetch(interaction.options.get('user').value);

        const { position: targetRole } = user.roles.highest;
        const { position: requestRole } = interaction.member.roles.highest;
        const { position: botRole } = interaction.guild.members.me.roles.highest;

        if (!interaction.member.permissions.has(134217728n)) {
            return interaction.editReply("You don't have the permission to manage nicknames.");
        }

        if (targetRole >= requestRole || targetRole >= botRole || user.id === client.user.id) {
            return interaction.editReply('Cannot change nickname for the provided user.');
        }

        try {
            user.setNickname(name, interaction.options.get('reason')?.value);
            interaction.editReply(`<@${user.id}>'s nickname has been changed to ${name}.`);
        } catch(error) {
            interaction.editReply('Error occurred.');
            console.error(error);
        }
    },
};
