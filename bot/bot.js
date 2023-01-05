const {DISCORD_TOKEN} = require("./config.json");
const {Client, Events, GatewayIntentBits} = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});


client.on(Events.ClientReady, (c) => {
    console.log(`Client logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, (msg) => {
    if (msg.author.bot) return;
    console.log(msg.content);
})

function login(token) {
    client.login(token).catch(err => {
        console.log(err);
        console.log("Retrying Login..");
        setTimeout(login, 4000);
    })
}

login(DISCORD_TOKEN);