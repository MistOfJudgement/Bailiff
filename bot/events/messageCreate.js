const {Events} = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    Log: console,
    execute(msg) {
        if (msg.author.bot) return;
        this.Log.info(`[${this.name}]: ${msg.content}`);

    }
}