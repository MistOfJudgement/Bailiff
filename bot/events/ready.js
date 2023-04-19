const {Events} = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    Log: console,
    execute(client) {
        this.Log.info(`[${this.name}]: Client logged in as ${client.user.tag}`);

    }
}