const {REST, Routes} = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

const commands = [];

const commandsFiles = fs.readdirSync("./commands").filter(file=> file.endsWith(".js"));

for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config.DISCORD_TOKEN);

(async ()=>{
    try {
        console.log("Started refreshing commands");
        await rest.put(
            Routes.applicationCommands(config.CLIENT_ID),
            {body: commands}
        );
        console.log("done");
    } catch (error) {
        console.error(error);
    }
})();