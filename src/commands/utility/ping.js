module.exports = {
    name: 'ping',
    description: 'Pong!',
    run: async (client, interaction, args) => {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        return interaction.editReply(`Websocket Heartbeat: ${client.ws.ping}ms; Roundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    },
};
