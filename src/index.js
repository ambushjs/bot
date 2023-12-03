require('dotenv/config');

const BaseClient = require('./handlers/client');
const client = new BaseClient();

client.updateCommands = false;

client.on('ready', client.registerCommands);
client.on('interactionCreate', client.listenInteraction);

client.login(process.env.token);
