const { EmbedBuilder } = require('discord.js');
const { getList, fromString } = require('../../lib/wandbox');

const embeds = require('./embeds');

module.exports = async function handleModal(interaction, client) {
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

    if (interaction.customId === 'modal-compile') {
        const input = interaction.fields.getTextInputValue('language-input').toLowerCase();
        const language = input.startsWith('node') ? 'javascript' : input;
        const code = interaction.fields.getTextInputValue('code-input');

        await interaction.deferUpdate();

        getList(language).then((languageVersions) => {
            fromString({ code, compiler: languageVersions[0].name }).then(async (output) => {
                const { program_error, program_output } = output;

                if (program_error) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Compiling Error')
                                .setDescription(`There was an error in your given code while using \`${languageVersions[0].name}\`.`)
                                .addFields(
                                    { name: 'Compiled Input', value: `\`\`\`${language}\n${code}\n\`\`\``, inline: true },
                                    { name: 'Compiling Error', value: `\`\`\`${program_error}\n\`\`\`` }
                                )
                                .setColor(0xfa5f55)
                                .setTimestamp()
                                .setFooter({ text: 'Error', iconURL: interaction.user.displayAvatarURL({ extension: 'png' }) }),
                        ],
                    });
                } else {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Compiled Code')
                                .setDescription(`Compiled and evaluated successfully using \`${languageVersions[0].name}\`. You can press the button again for the bot to run code again.`)
                                .addFields(
                                    { name: 'Compiled Input', value: `\`\`\`${language}\n${code}\n\`\`\``, inline: true },
                                    { name: 'Compiled Output', value: `\`\`\`${program_output ? language : ''}\n${program_output ? program_output : 'No output was received while evaluating.'}\n\`\`\`` }
                                )
                                .setColor(0x4b9cd3)
                                .setTimestamp()
                                .setFooter({ text: 'Compiled', iconURL: interaction.user.displayAvatarURL({ extension: 'png' }) }),
                        ],
                    });
                }
            }).catch(async (error) => {
                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`${error}. Try pressing the \`Insert Code\` button to try again.`)
                            .setColor(0xfa5f55),
                    ],
                    ephemeral: true,
                });
            });
        }).catch(async (error) => {
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${error} View all of the [available languages here](https://github.com/srz-zumix/wandbox-api#cli).\nIn addition, try not to use aliases. (\`py\` > \`python\`)`)
                        .setColor(0xfa5f55),
                ],
                ephemeral: true,
            });
        });
    }
};
