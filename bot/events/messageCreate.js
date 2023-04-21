import {Events} from "discord.js";

export default {
    name: Events.MessageCreate,
    once: false,
    Log: console,
    async execute(msg) {
        if(!msg.guild) return;
        if (msg.author.bot) return;
        this.Log.info(`[${this.name}]: ${msg.content}`);

        // if(msg.content === "-join") {
        //     await audio.execute(msg);
        // }
    }
}