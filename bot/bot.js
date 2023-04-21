import DISCORD_TOKEN from "./config.json" assert {type: "json"};

import {Client, Collection, GatewayIntentBits} from "discord.js";

import winston from "winston";

import fs from "fs";

import path from "path";
import {fileURLToPath} from "url";

import {createRequire} from "module";
const require = createRequire(import.meta.url);
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
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,

    ]
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // const command = require(filePath);
    const command = await import(filePath);
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    event.Log = Log;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}


function login(token) {
    client.login(token).catch(err => {
        Log.error(err);
        Log.info("Retrying Login..");
        setTimeout(login, 4000);
    })
}

login(DISCORD_TOKEN);