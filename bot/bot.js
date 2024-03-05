import config from "./config.json" assert {type: "json"};
const {DISCORD_TOKEN} = config;
import {Client, Collection, GatewayIntentBits} from "discord.js";


import fs from "fs";

import path from "path";
import {fileURLToPath} from "url";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Log from "../log.js";
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
client.messageCommands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    let filePath = path.join(commandsPath, file);
    // const command = require(filePath);
    filePath = "file:///" + filePath.replace(/\\/g, "/");
    const {default : command} = await import(filePath);
    if(command.type === "message") {
        Log("Loading command: " + command.name);
        client.messageCommands.set(command.name, command);
    } else {
        Log("Loading slash command: " + command.data.name);
        client.commands.set(command.data.name, command);
    }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    let filePath = path.join(eventsPath, file);
    filePath = "file:///" + filePath.replace(/\\/g, "/");
    const {default : event} = await import(filePath);
    Log("Loading event: " + event.name);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

let tries = 0;
function login(token) {
    client.login(token).catch(err => {
        Log(err);
        Log("Retrying Login..");
        if (tries < 5) {
            tries++;
            setTimeout(login, 4000);

        }
    })
}
//on control c
process.on('SIGINT', async function() {
    Log("Caught interrupt signal");
    await client.destroy();
    process.exit();
});
login(DISCORD_TOKEN);