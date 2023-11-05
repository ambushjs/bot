const { Client, Collection } = require('discord.js');
// const { modalListener } = require('./modals.js');
const { readdirSync } = require('fs');

module.exports = class BaseClient extends Client {
    commands = new Collection();

    constructor() {
        super({
            intents: [1, 2, 8, 256],
            partials: [0, 1],
        });
    }

    async registerCommands() {
        for (const directory of readdirSync('src/commands')) {
            for (const file of readdirSync(`src/commands/${directory}`)) {
                const command = require(`./commands/${directory}/${file}`);
                this.commands.set(command.name, { ...command, directory });
            }
        }

        console.log(this.commands)

        const commands = await this.application.commands.fetch();
        await this.application.commands.set(Array.from(this.commands.values()));

        for (const command of commands.toJSON()) {
            Object.defineProperty(this.commands.get(command.name), 'id', {
                value: command.id,
                writable: true,
            });
        }

        console.log('Commands Loaded!');
    }

    async listenInteraction(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = this.commands.get(interaction.commandName);

            if (!command) return;

            await command.run(this, interaction);
        }

        // if (interaction.isModalSubmit()) modalListener(interaction, this);
    }
}
