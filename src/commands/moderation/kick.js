const { CommandInteraction } = require('discord.js');
const BaseClient = require('../../handlers/client');

module.exports = {
    name: 'kick',
    description: 'Kick a user.',
    options: [
        {
            name: 'user',
            description: 'The user to be kicked.',
            type: 6,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for kick.',
            type: 3,
            required: false,
        }
    ],

    /**
     *
     * @param {BaseClient} client
     * @param {CommandInteraction} interaction
     * @returns {CommandInteraction} Returns an application interaction.
     */
    run: async (client, interaction) => {
        await interaction.deferReply();

        const user = await interaction.guild.members.fetch(interaction.options.get('user').value);

        const { position: targetRole } = user.roles.highest;
        const { position: requestRole } = interaction.member.roles.highest;
        const { position: botRole } = interaction.guild.members.me.roles.highest;

        if (!interaction.member.permissions.has(2n)) {
            return interaction.editReply('You don\'t have the permission to kick members.');
        }

        if (targetRole >= requestRole || targetRole >= botRole || user.id === client.user.id) {
            return interaction.editReply('Cannot kick provided user.');
        }

        try {
            user.kick(interaction.options.get('reason')?.value);
            return interaction.editReply(`<@${user.id}> has been kicked.`);
        } catch(error) {
            console.error(error);
            return interaction.editReply('Error occurred.');
        }
    },
};
