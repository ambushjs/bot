const { ActionRowBuilder, ButtonBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, CommandInteraction } = require('discord.js');

const { chunk } = require('ambush');
const { readdirSync } = require('fs');

const BaseClient = require('../../handlers/client');
const embeds = require('../../handlers/embeds');

module.exports = {
    name: 'help',
    description: 'Explore all the commands and insights available with this bot.',
    /**
     *
     * @param {BaseClient} client
     * @param {CommandInteraction} interaction
     */
    run: async (interaction, client) => {
        let page = 0;
        let value = 0;

        await interaction.deferReply();

        const categories = readdirSync('src/commands')
            .map((directory) => ({
                dir: `${directory.charAt(0).toUpperCase()}${directory.slice(1)}`,
                commands: client.commands
                    .filter((command) => command.directory === directory)
                    .map(({ name, description, id }) => ({ name, description, id })),
            }));

        const homeEmbed = embeds.helpHome(interaction.user);

        const selectRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('categories')
                    .setPlaceholder('Select a category')
                    .addOptions(categories.map(({ dir }) => ({ label: dir, value: dir }))),
            );

        const toolRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('home').setLabel('Home').setStyle(2),
                new ButtonBuilder().setCustomId('contact').setLabel('Contact').setStyle(2),
                new ButtonBuilder().setCustomId('statistics').setLabel('Statistics').setStyle(2),
            );

        const pageRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('previous').setLabel('<').setStyle(1).setDisabled(true),
                new ButtonBuilder().setCustomId('exit').setLabel('X').setStyle(4),
                new ButtonBuilder().setCustomId('next').setLabel('>').setStyle(1),
            );

        const reply = await interaction.editReply({
            embeds: [homeEmbed],
            components: [selectRow, toolRow, pageRow],
        });

        function filter(i) {
            return i.user.id === interaction.user.id;
        }

        async function updatePage(i) {
            await i.deferUpdate();

            const { commands } = categories.find((cat) => cat.dir === i.values[0]);
            const cmdChunk = chunk(commands, 10);

            page === 0 ?
                pageRow.components[0].setDisabled(true) :
                pageRow.components[0].setDisabled(false);

            page < cmdChunk.length - 1 ?
                pageRow.components[2].setDisabled(false) :
                pageRow.components[2].setDisabled(true);

            const embed = embeds.helpPage(interaction.user, value, commands.length);

            for (const command of cmdChunk[page]) {
                embed.addFields({
                    name: `</${command.name}:${command.id}>`,
                    value: `<:joiner:1180596122536919161> ${command.description}`
                });
            }

            return i.editReply({ embeds: [embed], components: [selectRow, toolRow, pageRow] });
        }

        const selectCollect = reply.createMessageComponentCollector({ componentType: 3, time: 60000, filter });
        const toolCollect = reply.createMessageComponentCollector({ componentType: 2, time: 60000, filter });
        const pageCollect = reply.createMessageComponentCollector({ componentType: 2, time: 60000, filter });

        selectCollect.on('collect', async (i) => {
            value = i.values[0];
            return updatePage(i);
        });

        toolCollect.on('collect', async (i) => {
            if (i.customId === 'home') {
                await i.deferUpdate();
                return i.editReply({ embeds: [homeEmbed] });
            }

            if (i.customId === 'contact') {
                const topic = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('topic')
                        .setLabel('Topic')
                        .setPlaceholder('Type your topic here')
                        .setStyle(1)
                        .setMaxLength(50),
                );

                const description = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('Description')
                        .setPlaceholder('Type your description here')
                        .setStyle(2),
                );

                await i.showModal(
                    new ModalBuilder()
                        .setCustomId('contact')
                        .setTitle('Contact developers')
                        .addComponents([topic, description]),
                );
            }
        });

        pageCollect.on('collect', async (i) => {
            if (i.customId === 'exit') {
                selectCollect.stop();
                toolCollect.stop();

                return pageCollect.stop();
            }

            if (i.customId === 'previous') {
                page--;
                return updatePage(i);
            }

            if (i.customId === 'next') {
                page++;
                return updatePage(i);
            }
        });

        pageCollect.on('end', async () => {
            [selectRow, toolRow, pageRow].forEach((row) => {
                for (const component of row.components) {
                    component.setDisabled(true);
                }
            });

            await interaction.editReply({ components: [selectRow, toolRow, pageRow] });
        });
    }
};
