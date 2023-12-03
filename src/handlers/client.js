const { Client, Collection, CommandInteraction } = require('discord.js');
const { readdirSync } = require('fs');

const handleModal = require('./modal');

class BaseClient extends Client {
    constructor() {
        super({ intents: [1, 2, 8, 256], partials: [0, 1] });

        this.commands = new Collection();
        this.updateCommands = false;
    }

    /**
     * Listen for application commands and handle it.
     *
     * @param {CommandInteraction} interaction - The current interaction data.
     * @returns {void} Returns no specific value.
     */
    async listenInteraction(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = this.commands.get(interaction.commandName);

            if (!command) {
                return;
            }

            await command.run(this, interaction);
        }

        if (interaction.isModalSubmit()) {
            await handleModal(this, interaction);
        }
    }

    /**
     * Register and set the client commands.
     *
     * @returns {void} Returns no specific value.
     */
    async registerCommands() {
        for (const directory of readdirSync('src/commands')) {
            for (const file of readdirSync(`src/commands/${directory}`)) {
                const command = require(`../commands/${directory}/${file}`);
                this.commands.set(command.name, { ...command, directory });
            }
        }

        const commands = await this.application.commands.fetch();

        if (this.updateCommands) {
            await this.application.commands.set(Array.from(this.commands.values()));
        }

        for (const command of commands.toJSON()) {
            Object.defineProperty(this.commands.get(command.name), 'id', {
                value: command.id,
                writable: true,
            });
        }

        console.log('Commands Loaded!');
    }
}

module.exports = BaseClient;
