require('dotenv/config');

const BaseClient = require('./BaseClient');
const app = require('express')();
const client = new BaseClient();

client.on('ready', async () => {
    client.user.setStatus('idle');
    await client.registerCommands();
});

client.on('interactionCreate', client.listenInteraction);
client.login(process.env.token);

app.get('/', (_, res) => {
    res.send('Listening!')
});

app.listen(3000);
