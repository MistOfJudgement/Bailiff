const {DISCORD_TOKEN} = require("./config.json");
const {Client, Events, GatewayIntentBits, Collection} = require("discord.js");
const path = require("path");
const fs = require("fs");
const winston = require("winston");
const Log = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {service: "bailiff-bot"},
    transports : [
        new winston.transports.File({
            filename: "bot_error.log",
            level:"error",
            format:winston.format.timestamp(),
            tailable: true
        }),
        new winston.transports.File({
            filename: "bot_combined.log",

        }),
        new winston.transports.Console({

        })
    ]
})
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, (c) => {
    console.log(`Client logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, (msg) => {
    if (msg.author.bot) return;
    console.log(msg.content);
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
        await interaction.reply({content: "There was an error. Whoops", ephemeral:true});
    }
})

function login(token) {
    client.login(token).catch(err => {
        console.log(err);
        console.log("Retrying Login..");
        setTimeout(login, 4000);
    })
}

login(DISCORD_TOKEN);