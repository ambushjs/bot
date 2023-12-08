const {
    ActionRowBuilder,
    ButtonBuilder,
    ModalBuilder,
    TextInputBuilder,
} = require('discord.js');

const embeds = require('../../handlers/embeds');

module.exports = {
    name: 'compile',
    description: 'Execute and run a code snippet supporting a variety of languages',
    run: async (interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const component = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('code').setLabel('Insert Code').setStyle(3),
            new ButtonBuilder().setCustomId('exit').setLabel('Exit').setStyle(4),
        );

        function filter(i) {
            return i.user.id === interaction.user.id;
        }

        const msg = await interaction.followUp({ embeds: [embeds.compileMain(interaction.user)], components: [component] });
        const collector = msg.createMessageComponentCollector({ componentType: 2, filter });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.followUp({
                    embeds: [embeds.fail],
                    ephemeral: true,
                });
            }

            if (i.customId === 'code') {
                const modal = new ModalBuilder().setCustomId('compile').setTitle('Compile Code');
                const inputLanguage = new TextInputBuilder().setCustomId('language').setLabel('Programming Language').setPlaceholder('Enter what language your code is in here').setStyle(1).setMaxLength(20).setRequired(true);
                const inputCode = new TextInputBuilder().setCustomId('code').setLabel('Code').setPlaceholder('Enter your code to evaluate here').setStyle(2).setRequired(true);
                const actionLanguage = new ActionRowBuilder().addComponents(inputLanguage);
                const actionCode = new ActionRowBuilder().addComponents(inputCode);

                modal.addComponents([actionLanguage, actionCode]);

                await i.showModal(modal);
            }
            
            if (i.customId === 'exit') {
                component.components[0].setDisabled(true);
                component.components[1].setDisabled(true);

                await i.deferUpdate();
                await i.editReply({ components: [component] });

                return collector.stop();
            }
        });
    },
};
