const { CommandInteraction } = require('discord.js');
const BaseClient = require('../../handlers/client');

module.exports = {
    name: 'ping',
    description: 'Pong!',
    /**
     *
     * @param {BaseClient} client
     * @param {CommandInteraction} interaction
     * @returns {CommandInteraction} Returns an application interaction.
     */
    run: async (interaction, client) => {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        return interaction.editReply(`Websocket Heartbeat: ${client.ws.ping}ms; Roundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    },
};
